import * as ts from "typescript";
import * as vscode from "vscode";
import { i18nAttributeAnalyzer } from "./i18n-attribute-analyzer";
import { LocalizeStringAnalyzer } from "./localize-string-analyzer";

function runHtmlAnalyzers(editor: vscode.TextEditor): vscode.Diagnostic[] {
  const attributeAnalyzer = new i18nAttributeAnalyzer(editor);

  return [...attributeAnalyzer.analyze()];
}

// Helper to check if it's a TypeScript file we want to analyze
function isTypeScriptFile(document: vscode.TextDocument): boolean {
  return (
    (document.languageId === "typescript" ||
      document.languageId === "javascript") &&
    (document.fileName.endsWith(".component.ts") ||
      document.fileName.endsWith(".service.ts") ||
      document.fileName.endsWith(".pipe.ts"))
  );
}

export function activate(context: vscode.ExtensionContext) {
  // Create TS diagnostic collection
  const typescriptDiagnostics =
    vscode.languages.createDiagnosticCollection("localize");
  context.subscriptions.push(typescriptDiagnostics);

  // Register HTML diagnostics
  const htmlDiagnostics = vscode.languages.createDiagnosticCollection("i18n");
  context.subscriptions.push(htmlDiagnostics);

  // Function to analyze the current document
  function analyzeCurrentDocument(document: vscode.TextDocument) {
    if (document.languageId === "html") {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        htmlDiagnostics.clear(); // clear to avoid duplicate diagnostics
        const diagnostics = runHtmlAnalyzers(editor);
        htmlDiagnostics.set(document.uri, diagnostics);
      }
    } else if (isTypeScriptFile(document)) {
      try {
        const sourceFile = ts.createSourceFile(
          document.fileName,
          document.getText(),
          ts.ScriptTarget.Latest,
          true
        );

        const analyzer = new LocalizeStringAnalyzer(sourceFile);
        const newDiagnostics = analyzer.analyze();

        typescriptDiagnostics.set(document.uri, newDiagnostics);
      } catch (error) {
        console.error("Error analyzing TypeScript document:", error);
        typescriptDiagnostics.set(document.uri, []);
      }
    }
  }

  // Register event handlers
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      analyzeCurrentDocument(event.document);
    }),

    vscode.workspace.onDidOpenTextDocument((document) => {
      analyzeCurrentDocument(document);
    }),

    vscode.workspace.onDidCloseTextDocument((document) => {
      typescriptDiagnostics.delete(document.uri);
      htmlDiagnostics.delete(document.uri);
    })
  );

  // Analyze all open documents
  vscode.workspace.textDocuments.forEach(analyzeCurrentDocument);
}

export function deactivate() {}
