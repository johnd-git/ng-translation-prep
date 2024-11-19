// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "i18n-lint" is now active!');

  // Replace the i18nPlainTextLint command implementation
  const i18nPlainTextLint = vscode.commands.registerCommand(
    "i18n-lint.i18nPlainTextLint",
    async () => {
      vscode.window.showInformationMessage("Hello World from i18n-lint!");

      // Get the active text editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor found");
        return;
      }

      // Check if it's an HTML file
      if (!editor.document.fileName.endsWith(".html")) {
        vscode.window.showWarningMessage(
          "This command only works with HTML files"
        );
        return;
      }

      const text = editor.document.getText();
      const diagnostics: vscode.Diagnostic[] = [];

      // Create diagnostics collection
      const diagnosticCollection =
        vscode.languages.createDiagnosticCollection("i18n-lint");

      // TODO: Implement HTML parsing and checking logic
      // For now, let's just show we've processed the file
      vscode.window.showInformationMessage(
        `Checking file: ${editor.document.fileName}`
      );
    }
  );

  context.subscriptions.push(i18nPlainTextLint);
}

// This method is called when your extension is deactivated
export function deactivate() {}
