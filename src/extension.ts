import * as vscode from "vscode";
import { I18nAnalyzer } from "./i18n-analyzer";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("i18n-lint");
  context.subscriptions.push(diagnosticCollection);

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

      // Clear existing diagnostics before running new analysis
      diagnosticCollection.clear();

      // Create analyzer instance and run analysis
      const analyzer = new I18nAnalyzer(editor);
      const diagnostics = analyzer.analyze();

      // Update diagnostics
      diagnosticCollection.set(editor.document.uri, diagnostics);
    }
  );

  context.subscriptions.push(i18nPlainTextLint);
}

// This method is called when your extension is deactivated
export function deactivate() {}
