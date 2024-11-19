import { TextDocument } from "vscode";

/**
 * Determines if a given document is a TypeScript or JavaScript file that should be analyzed
 * @param document - The VS Code TextDocument to check
 * @returns True if the document is either a TypeScript or JavaScript file with a component, service, or pipe extension
 */
export function isTsOrJsFile(document: TextDocument): boolean {
  return (
    (document.languageId === "typescript" ||
      document.languageId === "javascript") &&
    (document.fileName.endsWith(".component.ts") ||
      document.fileName.endsWith(".service.ts") ||
      document.fileName.endsWith(".pipe.ts"))
  );
}
