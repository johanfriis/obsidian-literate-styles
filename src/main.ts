import { Plugin, TFile, TFolder, Notice } from 'obsidian';
import { LiterateStylesTab, DEFAULT_SETTINGS, Settings } from './settings';
import { extname } from 'path';
import { zcss } from 'zcss.js';

const LITERATE_STYLES_CLASSNAME = 'literate-styles';

export default class LiterateStylesPlugin extends Plugin {
  settings: Settings;

  buffer: Map<string, Set<string>>;
  fileQueue: Set<TFile>;
  timeoutId: NodeJS.Timeout;
  style: HTMLStyleElement;
  skipDebounce: boolean;

  async onload() {
    console.log('Loading Literate Styles plugin ...');

    await this.loadSettings();
    this.addSettingTab(new LiterateStylesTab(this.app, this));

    this.startPlugin();

    this.addCommand({
      id: 'literate-styles-refresh',
      name: 'Refresh Current File',
      checkCallback: (checking) => {
        const file = this.app.workspace.getActiveFile();
        if (!file || !this.canProcess(file)) {
          return false;
        }
        if (checking) {
          return true;
        }
        this.skipDebounce = true;
        this.handleEvent(file);
        this.skipDebounce = false;
      },
    });

    // console.log('Literate Styles plugin running ...');
  }

  startPlugin() {
    if (!this.settings.stylesFolder) {
      new Notice('Literate Styles can not work without a styles folder set');
      return;
    }

    this.fileQueue = new Set();
    this.buffer = new Map();
    this.skipDebounce = false;

    /**
     * Add the style element we will be writing to to the header
     */
    document
      .querySelectorAll(`.${LITERATE_STYLES_CLASSNAME}`)
      .forEach((e) => e.remove());

    this.style = document.createElement('style');
    this.style.setAttribute('type', 'text/css');
    this.style.addClass(LITERATE_STYLES_CLASSNAME);
    document.head.appendChild(this.style);

    /**
     * Attach event handlers to create and modify events throughout the vault
     */
    this.registerEvent(
      this.app.vault.on('create', this.handleEvent.bind(this))
    );
    this.registerEvent(
      this.app.vault.on('modify', this.handleEvent.bind(this))
    );

    /**
     * Also run through every file once on initialisation.
     */
    this.app.workspace.onLayoutReady(async () => {
      const files = this.app.vault.getMarkdownFiles();
      this.skipDebounce = true;
      await Promise.all(files.map((file) => this.handleEvent(file)));
      this.skipDebounce = false;
    });
  }

  /**
   * Handle events from obsidian and check a few things before handing the event off:
   * - Abort if  arg is not passed at all, or the arg is a folder
   * - Abort if file is not an .md file and not within the literate styles folder
   * If all checks pass, request a parse for this file
   */
  async handleEvent(arg?: TFolder | TFile | null) {
    if (this.canProcess(arg)) {
      // console.log('Requesting a parse of file', arg.path);
      await this.requestParse(arg);
    }
  }

  /**
   * Add file to the queue and fire off a debounced parseQueue
   */
  async requestParse(file: TFile) {
    const { refreshRate } = this.settings;

    if (refreshRate === 0 && !this.skipDebounce) {
      return;
    }

    this.fileQueue.add(file);

    if (this.skipDebounce) {
      this.parseQueue();
      return;
    }

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.parseQueue();
    }, refreshRate);
  }

  /**
   * Process every file in the queue
   */
  async parseQueue() {
    for (const file of this.fileQueue) {
      /**
       * Store all style blocks of this file in a local buffer first
       */
      const localBuffer = new Set<string>();

      /**
       * Read the file contents and split them into an array of lines
       */
      const contents = await app.vault.cachedRead(file);
      const lines = contents.split('\n');

      /**
       * For every line, look for a start of a css code fence and start capturing
       * lines into an array. Split code fences into their own array, to be parsed
       * and handled individually.
       */
      const styleFences: string[][] = [];
      const startRegex = /^\s*```s?css/;
      const endRegex = /^\s*```/;
      let shouldCapture = false;

      let fenceIndex = 0;
      for (const line of lines) {
        if (line.match(startRegex)) {
          shouldCapture = true;
          styleFences.push([]);
          continue;
        }
        if (shouldCapture) {
          if (line.match(endRegex)) {
            shouldCapture = false;
            fenceIndex++;
            continue;
          }
          styleFences[fenceIndex].push(line);
        }
      }

      for (const fence of styleFences) {
        const styles = fence.join('\n');
        /**
         * For now we don't do any error handling. Eventually I want to pass
         * this through prettier.
         */
        const output = zcss(styles);
        localBuffer.add(output);
      }
      /**
       * Add the localBuffer to the global buffer
       */
      this.buffer.set(file.path, localBuffer);
    }

    /**
     * Now that we have parsed the code fences, clear the queue
     * and pass the rest off to the style renderer
     */
    this.fileQueue.clear();
    this.render();
  }

  /**
   * Render the contents of the buffer to the style element we are using
   */
  render() {
    const css = [...this.buffer.values()]
      .map((styleSet) => [...styleSet].join('\n'))
      .join('\n');

    this.style.innerHTML = css;
  }

  onunload() {
    console.log('Unloading Literate Styles plugin ...');
    this.fileQueue.clear();
    this.buffer.clear();
    document
      .querySelectorAll(`.${LITERATE_STYLES_CLASSNAME}`)
      .forEach((e) => e.remove());
  }

  canProcess(arg?: TFolder | TFile | null): arg is TFile {
    const { stylesFolder = '' } = this.settings;

    if (
      !arg ||
      this.isFolder(arg) ||
      !arg.path.startsWith(stylesFolder) ||
      extname(arg.path) !== '.md'
    ) {
      return false;
    }
    return true;
  }

  isFolder(arg: TFolder | TFile): boolean {
    if (arg instanceof TFolder) {
      return true;
    }
    return false;
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
    this.startPlugin();
  }
}
