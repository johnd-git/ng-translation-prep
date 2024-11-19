import * as vscode from "vscode";
import * as ts from "typescript";

export class LocalizeStringAnalyzer {
  // Patterns that should be ignored
  private readonly IGNORE_PATTERNS = [
    /^https?:\/\//, // URLs
    /^[#.][a-zA-Z-_]+/, // CSS selectors and classes
    /^$/, // Empty strings
    /^[\d\s]*$/, // Numbers and whitespace
    /^[!@#$%^&*(),.?":{}|<>]*$/, // Special characters
  ];

  constructor(private readonly sourceFile: ts.SourceFile) {}

  analyze(): vscode.Diagnostic[] {
    const diagnostics: vscode.Diagnostic[] = [];

    const visit = (node: ts.Node) => {
      if (ts.isStringLiteral(node)) {
        this.analyzeStringLiteral(node, diagnostics);
      }
      ts.forEachChild(node, visit);
    };

    visit(this.sourceFile);
    return diagnostics;
  }

  private analyzeStringLiteral(
    node: ts.StringLiteral,
    diagnostics: vscode.Diagnostic[]
  ) {
    const text = node.text;

    // Skip if matches any ignore patterns
    if (this.IGNORE_PATTERNS.some((pattern) => pattern.test(text))) {
      return;
    }

    // Skip if parent is already a tagged template with $localize
    if (this.isLocalizeTaggedTemplate(node)) {
      return;
    }

    // Create diagnostic
    const startPos = this.sourceFile.getLineAndCharacterOfPosition(
      node.getStart()
    );
    const endPos = this.sourceFile.getLineAndCharacterOfPosition(node.getEnd());

    const range = new vscode.Range(
      new vscode.Position(startPos.line, startPos.character),
      new vscode.Position(endPos.line, endPos.character)
    );

    diagnostics.push(
      new vscode.Diagnostic(
        range,
        `String literal should use $localize tagged template literal`,
        vscode.DiagnosticSeverity.Warning
      )
    );
  }

  private isLocalizeTaggedTemplate(node: ts.Node): boolean {
    if (node.parent && ts.isTaggedTemplateExpression(node.parent)) {
      const tag = node.parent.tag;
      return tag.getText() === "$localize";
    }
    return false;
  }
}
