# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- refactor: switch css renderer to less
- refactor: instead of running every single code fence through the less
  renderer run all the code fences through less at once. This means we only get
  a render when things are looking good, so styles don't flash in and out when
  there is a compile error.

## [0.1.2] - 2022-09-11

### Changed

- refactor: :fire: remove sass in favour of zcss.js

The bundle size of the plugin with sass was more than 4MB.
That is not acceptable.

## [0.1.1] - 2022-09-05

### Changed

- :bug: Saving settings caused new style elements to be added to head

## [0.1.0] - 2022-09-04

### Added

- :sparkles: Reference implementation of Literate Styles Obsidian plugin.

[unreleased]: https://github.com/johanfriis/obsidian-literate-styles/compare/0.1.1...HEAD
[0.1.2]: https://github.com/johanfriis/obsidian-literate-styles/releases/tag/0.1.2
[0.1.1]: https://github.com/johanfriis/obsidian-literate-styles/releases/tag/0.1.1
[0.1.0]: https://github.com/johanfriis/obsidian-literate-styles/releases/tag/0.1.0
