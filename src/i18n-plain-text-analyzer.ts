import * as vscode from "vscode";
import * as parse5 from "parse5";
import { Node, Element } from "parse5/dist/common/tree-adapter";

export class I18nPlainTextAnalyzer {
  constructor(private editor: vscode.TextEditor) {}

  public analyze(): vscode.Diagnostic[] {
    const text = this.editor.document.getText();
    const diagnostics: vscode.Diagnostic[] = [];
    const document = parse5.parse(text, { sourceCodeLocationInfo: true });

    this.analyzeNode(document, diagnostics);
    return diagnostics;
  }

  private analyzeNode(
    node: Node,
    diagnostics: vscode.Diagnostic[],
    parentHasI18n: boolean = false
  ) {
    if (this.isElement(node)) {
      const hasI18n = node.attrs?.some((attr) => attr.name === "i18n");

      // Analyze children nodes
      node.childNodes?.forEach((child) =>
        this.analyzeNode(child, diagnostics, parentHasI18n || hasI18n)
      );
    } else if (this.isTextNode(node) && !parentHasI18n) {
      this.analyzeTextNode(node, diagnostics);
    }
  }

  private analyzeTextNode(node: Node, diagnostics: vscode.Diagnostic[]) {
    const content = node.value.trim();
    if (content.length > 0 && !/^\s*$/.test(content)) {
      const startPos = this.editor.document.positionAt(
        node.sourceCodeLocation?.startOffset || 0
      );
      const endPos = this.editor.document.positionAt(
        node.sourceCodeLocation?.endOffset || 0
      );
      const range = new vscode.Range(startPos, endPos);

      diagnostics.push(
        new vscode.Diagnostic(
          range,
          `Text "${content}" should be marked for translation using i18n`,
          vscode.DiagnosticSeverity.Warning
        )
      );
    }
  }

  private isElement(node: Node): node is Element {
    return node.nodeName !== "#text";
  }

  private isTextNode(node: Node): boolean {
    return node.nodeName === "#text";
  }
}
