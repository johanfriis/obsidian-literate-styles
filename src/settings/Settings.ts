import { App, PluginSettingTab, Setting } from 'obsidian';
import LiterateStylesPlugin from '../main';
import { Settings } from './Settings.types';

export const DEFAULT_SETTINGS: Settings = {
  stylesFolder: undefined,
  refreshRate: 2500,
  errorNoticeTimeout: 10000,
};

export class LiterateStylesTab extends PluginSettingTab {
  plugin: LiterateStylesPlugin;

  constructor(app: App, plugin: LiterateStylesPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    this.addHeading();
    this.addStylesFolderSetting();
    this.addRefreshRateSetting();
    this.addErrorNoticeTimeoutSetting();
  }

  addHeading(): void {
    this.containerEl.createEl('h2', { text: 'Literate Styles Settings' });
  }

  addStylesFolderSetting(): void {
    new Setting(this.containerEl)
      .setName('Styles folder location')
      .setDesc('Files in this folder will be treated as literate style files.')
      .addText((text) =>
        text
          .setPlaceholder('Path/To/Literate Styles/Folder')
          .setValue(this.plugin.settings.stylesFolder ?? '')
          .onChange(async (value) => {
            this.plugin.settings.stylesFolder = value;
            await this.plugin.saveSettings();
          })
      );
  }

  addRefreshRateSetting(): void {
    new Setting(this.containerEl)
      .setName('Refresh Rate')
      .setDesc(
        `Pause for X milliseconds after last change before a refresh will trigger. A value of 0 disables automatic refresh.`
      )
      .addSlider((slider) =>
        slider
          .setLimits(0, 10000, 500)
          .setValue(this.plugin.settings.refreshRate)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.refreshRate = value;
            await this.plugin.saveSettings();
          })
      );
  }

  addErrorNoticeTimeoutSetting(): void {
    new Setting(this.containerEl)
      .setName('Error Notice Timeout')
      .setDesc(
        `Time in milliseconds the error notice should stay visible. A value of 0 disables error notice.`
      )
      .addSlider((slider) =>
        slider
          .setLimits(0, 25000, 500)
          .setValue(this.plugin.settings.errorNoticeTimeout)
          .setDynamicTooltip()
          .onChange(async (value) => {
            this.plugin.settings.errorNoticeTimeout = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
