# ng-translation-prep

**ng-translation-prep** is a VS Code extension designed to lint for tags needed in the internationalization (i18n) process for Angular applications. This helps developers prepare their HTML and TypeScript files for translation by automatically identifying and marking text for localization using `i18n` + `i18n-*` attributes and `$localize` tags.

## Features

- **Linting Support**: Automatically checks for missing `i18n` attributes, `i18n-*` attributes and `$localize` tags in your Angular code.
- **Quick Fixes**: Provides suggestions and correct to easily add or correct i18n/localization markers.

!Feature Example

> Tip: feature tip goes here!

## Requirements

- **Angular CLI**: Ensure you have Angular CLI installed to work with Angular projects.
- **Node.js**: This extension requires Node.js to run.

## Known Issues

- The code quick fix that wraps plain text in a span with i18n applied conflicts with the default behavior of VS Code that auto-closes HTML tags. To avoid this issue, overwrite the following setting in your VS Code settings:
  - `"html.autoClosingTags": false`

## Todo

- [ ] vs code settings/config for:
  - [ ] toggleable analyzers toggleable
  - [ ] wildcards for file endings to include in ts analyzer (ie: "**/\*.component.ts", "**/\*.service.ts",)
  - [ ] i18n-\* attribute inclusion list (this would replace the `I18N_ATTRIBUTES` array in `/src/i18n-attribute-analyzer.ts`)
- [ ] bypass code comment
- [ ] plenty improvement to be made in the ts analyzer
- [ ] consider debounce to limit eval cycles
- [ ] handle html that is within a component file
- [ ] handle deactivation
- [ ] only activate for angular projects
- [ ] tests

## Release Notes

### 1.0.0

Initial release of ng-translation-prep.

---

## Azure DevOps

- Followed instructions on this page
  - PAT for GitHub actions needs Marketplace Manage permissions.
  - PAT needs access to All Organizations
- CI/CD guidelines here

---
