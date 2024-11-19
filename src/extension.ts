import * as vscode from "vscode";
import { I18nAnalyzer } from "./i18n-analyzer";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "i18n-lint" is now active!');

  const i18nPlainTextLint = vscode.commands.registerCommand(
    "i18n-lint.i18nPlainTextLint",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("No active editor found");
        return;
      }

      if (!editor.document.fileName.endsWith(".html")) {
        vscode.window.showWarningMessage(
          "This command only works with HTML files"
        );
        return;
      }

      // Create analyzer instance and run analysis
      const analyzer = new I18nAnalyzer(editor);
      const diagnostics = analyzer.analyze();

      // Update diagnostics
      const diagnosticCollection =
        vscode.languages.createDiagnosticCollection("i18n-lint");
      diagnosticCollection.set(editor.document.uri, diagnostics);
    }
  );

  context.subscriptions.push(i18nPlainTextLint);
}

// This method is called when your extension is deactivated
export function deactivate() {}
