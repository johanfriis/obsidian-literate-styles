# Obsidian Literate Styles

Hello Obsidianites. Here is a little plugin I wrote that allows you to do
**this** inside Obsidian.

`TODO: add a GIF demonstrating the use`

Basically, this plugin allows you to write styles in and Obsidian folder that
are then applied to the current running Obsidian instance. A simple form of
`Literate Programming`.

### How to install

For now this plugin is not realeased on the Obsidian Plugin repository, so use
[BRAT][1] to install a beta version.

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

## Development Log

- 2022-09-04 - Released version 1.0.0. Realised that the plugin is a far shout
  from being a literate programming environment and that that is probably ok. I
  also had some ideas about block level caching and using frontmatter rather
  than a styled folder for determining what files to treat.

## Future Plans

I was considering getting rid of the stylesFolder settings and reading the
frontmatter of the file for some metadata stored there. I would be curious if
there is a quick way of getting the frontmatter only for a given TFile, and if
it would be an issue at all. Since we will only be loading styles across all
files it might not be so slow except for the first render.

To address the initial `fouc` upon opening Obsidian, and in the interest of
efficiency, we could have some file level caching, which would allow a
pregenerated stylesheet to be loaded very early in the render, and then only
later would we parse changed files again. :thinking:

I was also thinking about having named style blocks, similar to what is is
described in [jmeiners literate programing][2] examples. Take some inspiration
from [srcweave][3]. This would allow me to have block level caching as well as
show some UI directly on the block for when a block is being process, if there
are errors, etc ...

[1]: https://obsidian.md/plugins?id=obsidian42-brat
[2]: https://www.jmeiners.com/literate-programming
[3]: https://github.com/justinmeiners/srcweave
