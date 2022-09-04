# Obsidian Literate Styles

This plugin allows you to write styles in and Obsidian folder that are then
applied to the current running Obsidian instance.

`TODO: add a GIF demonstrating the use`

### How to install

For now this plugin is not realeased on the Obsidian Plugin repository, so use
[BRAT](https://obsidian.md/plugins?id=obsidian42-brat) to install a beta
version.

### What are Literate Styles

Literate programming is a type of programming where you code is interspersed
with text that describes the code, as well as some common features such as
`tangle` and `weave`. Literate Styles does not currently support tangling and
weaving, and I am not conviced that it would make sense, so for now I have no
ambition to implement that part.

### CSS or SCSS

Literate Styles run the css through the sass compiler, both so it can give some
feedback if the css is not well formed, and to enable writing actual scss. At
this point there is no difference whether the code block is labeled as as `css`
or `scss` code block, both are treated the same way

### Performance Considerations

I have not tested this on very large amounts of css, but I can imagine that at
some point it could start getting slow. I would like to develop some form of
caching, but at the moment I'm uncertain of the best way of keeping a stable
reference to a code block across file changes.

---

## For Mantainer

### How to release a new version

This describes my current workflow for releasing a new version:

- Decide on version bump and commit it
  - `npm version patch`
  - `npm version minor`
  - `npm version major`
- Generate changelog and edit it to be human
  - `npm run changelog`
- Stage changelog and ammend previous commit
  - `git add CHANGELOG.md`
  - `git commit --amend`
- Push commit to GH, letting the workflow handle the release
  - `git push origin --tags`
- Once release has been generated, modify version notes with changelog
