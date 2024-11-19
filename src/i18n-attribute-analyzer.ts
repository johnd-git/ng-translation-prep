import * as vscode from "vscode";
import * as parse5 from "parse5";
import { Node, Element } from "parse5/dist/common/tree-adapter";

//todo: make this configurable
const I18N_ATTRIBUTES: string[] = [
  "title",
  "placeholder",
  "label",
  "alt",
  "aria-label",
  "aria-description",
  "value",
  "aria-placeholder",
  "aria-roledescription",
  // Note: data-* attributes would need to be handled separately since they're dynamic
];

const DIAGNOSTIC_TYPES = {
  MISSING_I18N_DASH_ATTRIBUTE: "MISSING_I18N_DASH_ATTRIBUTE",
  MISSING_I18N: "MISSING_I18N_TEXT",
} as const;

export class i18nAttributeAnalyzer {
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
      const hasI18n = node.attrs?.some((attr: any) => attr.name === "i18n");

      // Check each internationalization attribute(s)
      if (node.attrs) {
        I18N_ATTRIBUTES.forEach((attrName) => {
          const hasAttribute = node.attrs.some(
            (attr: any) => attr.name === attrName
          );
          const hasI18nAttribute = node.attrs.some(
            (attr: any) => attr.name === `i18n-${attrName}`
          );

          if (hasAttribute && !hasI18nAttribute) {
            const attr = node.attrs.find((attr: any) => attr.name === attrName);
            const startPos = this.editor.document.positionAt(
              node.sourceCodeLocation?.attrs?.[attrName]?.startOffset || 0
            );
            const endPos = this.editor.document.positionAt(
              node.sourceCodeLocation?.attrs?.[attrName]?.endOffset || 0
            );
            const range = new vscode.Range(startPos, endPos);

            const diagnostic = new vscode.Diagnostic(
              range,
              `${attrName} attribute "${attr?.value}" should have a corresponding i18n-${attrName} attribute`,
              vscode.DiagnosticSeverity.Warning
            );
            diagnostic.code = DIAGNOSTIC_TYPES.MISSING_I18N_DASH_ATTRIBUTE;
            diagnostics.push(diagnostic);
          }
        });
      }

      // Analyze children nodes
      node.childNodes?.forEach((child: any) =>
        this.analyzeNode(child, diagnostics, parentHasI18n || hasI18n)
      );
    } else if (this.isTextNode(node) && !parentHasI18n) {
      this.analyzeTextNode(node, diagnostics);
    }
  }

  private analyzeTextNode(node: Node, diagnostics: vscode.Diagnostic[]) {
    const content = node.value.trim();

    // Skip if empty or only whitespace
    if (content.length === 0 || /^\s*$/.test(content)) {
      return;
    }

    // Skip if only numbers
    if (/^\d+$/.test(content)) {
      return;
    }

    // Skip if only special characters (including common punctuation)
    if (/^[^a-zA-Z0-9\u0080-\uFFFF]*$/.test(content)) {
      return;
    }

    // Skip if contains Angular interpolation syntax {{ }}
    if (/{{[^}]*}}/.test(content)) {
      return;
    }

    const startPos = this.editor.document.positionAt(
      node.sourceCodeLocation?.startOffset || 0
    );
    const endPos = this.editor.document.positionAt(
      node.sourceCodeLocation?.endOffset || 0
    );
    const range = new vscode.Range(startPos, endPos);

    const diagnostic = new vscode.Diagnostic(
      range,
      `Text "${content}" should be marked for translation using i18n`,
      vscode.DiagnosticSeverity.Warning
    );
    diagnostic.code = DIAGNOSTIC_TYPES.MISSING_I18N;
    diagnostics.push(diagnostic);
  }

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      switch (diagnostic.code) {
        case DIAGNOSTIC_TYPES.MISSING_I18N_DASH_ATTRIBUTE:
          // Handle attribute fixes
          const attrMatch = diagnostic.message.match(/i18n-([\w-]+) attribute/);
          if (attrMatch) {
            const action = new vscode.CodeAction(
              `Add i18n-${attrMatch[1]} attribute`,
              vscode.CodeActionKind.QuickFix
            );
            action.diagnostics = [diagnostic];
            action.edit = new vscode.WorkspaceEdit();

            // Insert the i18n attribute before the closing angle bracket
            action.edit.insert(
              document.uri,
              diagnostic.range.end,
              ` i18n-${attrMatch[1]}`
            );

            actions.push(action);
          }
          break;
        case DIAGNOSTIC_TYPES.MISSING_I18N:
          // Handle text node fixes
          // Add action to add i18n attribute to parent element
          const addAttributeAction = new vscode.CodeAction(
            "Add i18n to parent element",
            vscode.CodeActionKind.QuickFix
          );
          addAttributeAction.diagnostics = [diagnostic];
          addAttributeAction.edit = new vscode.WorkspaceEdit();

          // Find the parent element's opening tag
          const lineText = document.lineAt(diagnostic.range.start.line).text;
          const parentTagMatch = lineText.match(/<([^>]+?)>/);

          if (parentTagMatch) {
            const tagStart = lineText.indexOf("<");
            const insertPosition = new vscode.Position(
              diagnostic.range.start.line,
              tagStart + parentTagMatch[1].length + 1
            );
            addAttributeAction.edit.insert(
              document.uri,
              insertPosition,
              " i18n"
            );
            actions.push(addAttributeAction);
          }

          const wrapAction = new vscode.CodeAction(
            "Wrap text with i18n span",
            vscode.CodeActionKind.QuickFix
          );
          wrapAction.diagnostics = [diagnostic];
          wrapAction.edit = new vscode.WorkspaceEdit();

          // Get the text content from the diagnostic message
          const textMatch = diagnostic.message.match(/Text "(.*?)"/);
          const text = textMatch ? textMatch[1] : "";

          // Wrap the text in a span with i18n attribute
          wrapAction.edit.replace(
            document.uri,
            diagnostic.range,
            `<span i18n>${text}</span>`
          );

          actions.push(wrapAction);
      }
    }

    return actions;
  }

  private isElement(node: Node): node is Element {
    return node.nodeName !== "#text";
  }

  private isTextNode(node: Node): boolean {
    return node.nodeName === "#text";
  }
}
