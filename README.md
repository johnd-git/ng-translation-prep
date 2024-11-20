# ng-translation-prep README

This is the README for your extension "ng-translation-prep". After writing up a brief description, we recommend including the following sections.

## Features

Describe specific features of your extension including screenshots of your extension in action. Image paths are relative to this README file.

For example if there is an image subfolder under your extension project workspace:

\!\[feature X\]\(images/feature-x.png\)

> Tip: Many popular extensions utilize animations. This is an excellent way to show off your extension! We recommend short, focused animations that are easy to follow.

## Requirements

If you have any requirements or dependencies, add a section describing those and how to install and configure them.

## Extension Settings

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: Enable/disable this extension.
- `myExtension.thing`: Set to `blah` to do something.

## Known Issues

- Code quick fix that wraps plain text in a span with i18n applied conflicts with the derfault behvior of VS Code that auto closes html tags. To avoid this issue overwrite the following setting in VS code settings:
  - `"html.autoClosingTags": false,`

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of ...

### 1.0.1

Fixed issue #.

### 1.1.0

Added features X, Y, and Z.

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

- [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

## Azure DevOps

- Followed instructions on [this page](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
  - PAT for GitHub actions needs Marketplace Manage perms
- CI/CD guidelines [here](https://code.visualstudio.com/api/working-with-extensions/continuous-integration#automated-publishing)
