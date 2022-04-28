import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

export function setupTsxMode(content) {
  const modelUri = monaco.Uri.file("index.tsx");
  const codeModel = monaco.editor.createModel(
    content || "",
    "typescript",
    modelUri
  );

  //  设置typescript 使用jsx 的编译方式
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    jsx: "react",
  });

  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: false,
    noSyntaxValidation: false,
  });
  return codeModel;
}

export function setupHtmlMode(content) {
  const modelUri = monaco.Uri.file("index.html");
  const codeModel = monaco.editor.createModel(content || "", "html", modelUri);
  return codeModel;
}

export function setupJavascriptMode(content) {
  const modelUri = monaco.Uri.file("index.js");
  const codeModel = monaco.editor.createModel(
    content || "",
    "javascript",
    modelUri
  );
  return codeModel;
}

export function setupTypescriptMode(content) {
  const modelUri = monaco.Uri.file("index.ts");
  const codeModel = monaco.editor.createModel(
    content || "",
    "typescript",
    modelUri
  );
  return codeModel;
}

export function setupCssMode(content) {
  const modelUri = monaco.Uri.file("index.css");
  const codeModel = monaco.editor.createModel(content || "", "css", modelUri);
  return codeModel;
}
