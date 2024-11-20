# ng-translation-prep

**ng-translation-prep** is a VS Code extension designed to simplify the internationalization (i18n) process for Angular applications. This helps developers prepare their HTML and TypeScript files for translation by automatically identifying and marking text for localization using `$localize` and `i18n` attributes.

## Features

- **Linting Support**: Automatically checks for missing `i18n` attributes and `$localize` tags in your Angular code.
- **Quick Fixes**: Provides suggestions to easily add or correct localization markers.

!Feature Example

> Tip: feature tip goes here!

## Requirements

- **Angular CLI**: Ensure you have Angular CLI installed to work with Angular projects.
- **Node.js**: This extension requires Node.js to run.

## Extension Settings

This extension contributes the following settings:

- `ngTranslationPrep.enable`: Enable/disable this extension.
- `ngTranslationPrep.autoFix`: Automatically apply fixes for missing i18n attributes.

## Known Issues

- The code quick fix that wraps plain text in a span with i18n applied conflicts with the default behavior of VS Code that auto-closes HTML tags. To avoid this issue, overwrite the following setting in your VS Code settings:
  - `"html.autoClosingTags": false`

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ng-translation-prep.

---

## Azure DevOps

- Followed instructions on this page
  - PAT for GitHub actions needs Marketplace Manage permissions.
  - PAT needs access to All Organizations
- CI/CD guidelines here

---

Feel free to adjust any sections further to better fit your vision! How does this look?
