import ts from "typescript";
import * as vscode from "vscode";
import { i18nAttributeAnalyzer } from "./i18n-attribute-analyzer";
import { LocalizeStringAnalyzer } from "./localize-string-analyzer";
import { isTsOrJsFile } from "./util";

function runHtmlAnalyzers(editor: vscode.TextEditor): vscode.Diagnostic[] {
  const attributeAnalyzer = new i18nAttributeAnalyzer(editor);

  return [...attributeAnalyzer.analyze()];
}

function runTsAnalyzers(sourceFile: ts.SourceFile): vscode.Diagnostic[] {
  const localizeStringAnalyzer = new LocalizeStringAnalyzer(sourceFile);

  return [...localizeStringAnalyzer.analyze()];
}

export function activate(context: vscode.ExtensionContext) {
  // Register HTML diagnostics collection
  const htmlDiagnostics = vscode.languages.createDiagnosticCollection("i18n");
  context.subscriptions.push(htmlDiagnostics);
  // Register TS diagnostic collection
  const tsDiagnostics = vscode.languages.createDiagnosticCollection("localize");
  context.subscriptions.push(tsDiagnostics);

  // Function to analyze the current document
  function analyzeCurrentDocument(document: vscode.TextDocument) {
    if (document.languageId === "html") {
      const editor = vscode.window.activeTextEditor;
      if (editor && editor.document === document) {
        htmlDiagnostics.clear(); // clear to avoid duplicate diagnostics
        const diagnostics = runHtmlAnalyzers(editor);
        htmlDiagnostics.set(document.uri, diagnostics);
      }
    } else if (isTsOrJsFile(document)) {
      try {
        const sourceFile = ts.createSourceFile(
          document.fileName,
          document.getText(),
          ts.ScriptTarget.Latest,
          true
        );

        tsDiagnostics.clear();
        const diagnostics = runTsAnalyzers(sourceFile);
        tsDiagnostics.set(document.uri, diagnostics);
      } catch (error) {
        console.error("Error analyzing TypeScript document:", error);
        tsDiagnostics.set(document.uri, []);
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
      tsDiagnostics.delete(document.uri);
      htmlDiagnostics.delete(document.uri);
    }),

    vscode.languages.registerCodeActionsProvider(
      ["html"],
      {
        provideCodeActions(document, range, context) {
          const editor = vscode.window.visibleTextEditors.find(
            (e) => e.document === document
          );
          if (!editor) {
            return [];
          }

          const analyzer = new i18nAttributeAnalyzer(editor);
          return analyzer.provideCodeActions(document, range, context);
        },
      },
      {
        providedCodeActionKinds: [vscode.CodeActionKind.QuickFix],
      }
    )
  );

  // Analyze all open documents
  vscode.workspace.textDocuments.forEach(analyzeCurrentDocument);
}

export function deactivate() {}
