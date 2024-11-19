import * as vscode from "vscode";
import { i18nAttributeAnalyzer } from "./i18n-attribute-analyzer";

function runHtmlAnalyzers(editor: vscode.TextEditor): vscode.Diagnostic[] {
  const attributeAnalyzer = new i18nAttributeAnalyzer(editor);

  return [...attributeAnalyzer.analyze()];
}

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
  const diagnosticCollection =
    vscode.languages.createDiagnosticCollection("i18n-lint");
  context.subscriptions.push(diagnosticCollection);

  // Add document change listener
  const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
    const document = event.document;

    if (document.languageId === "html") {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        diagnosticCollection.clear(); // clear to avoid duplicate diagnostics
        const diagnostics = runHtmlAnalyzers(editor);
        diagnosticCollection.set(document.uri, diagnostics);
      }
    }
  });

  // add listener to subscriptions
  context.subscriptions.push(changeListener);
}

// This method is called when your extension is deactivated
export function deactivate() {}
