import React, { useRef, useEffect, useCallback } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { CommandsRegistry } from "monaco-editor/esm/vs/platform/commands/common/commands";
import debounce from "debounce";
import { registerDocumentFormattingEditProviders } from "./format";
import {
  setupTsxMode,
  setupHtmlMode,
  setupCssMode,
  setupJavascriptMode,
  setupTypescriptMode,
} from "./setupTsxMode";

window.MonacoEnvironment = {
  getWorkerUrl: (_moduleId, label) => {
    const v = `?v=${
      require("monaco-editor/package.json?fields=version").version
    }`;
    if (label === "css") return `/_next/static/css.worker.js${v}`;
    if (label === "html") return `/_next/static/html.worker.js${v}`;
    if (label === "typescript" || label === "javascript")
      return `/_next/static/ts.worker.js${v}`;
    return `/_next/static/editor.worker.js${v}`;
  },
};

function setupKeybindings(editor) {
  let formatCommandId = "editor.action.formatDocument";
  editor._standaloneKeybindingService.addDynamicKeybinding(
    `-${formatCommandId}`,
    null,
    () => {}
  );
  const { handler, when } = CommandsRegistry.getCommand(formatCommandId);
  editor._standaloneKeybindingService.addDynamicKeybinding(
    formatCommandId,
    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
    handler,
    when
  );
}
registerDocumentFormattingEditProviders();

const modes = {
  html: setupHtmlMode,
  css: setupCssMode,
  javascript: setupJavascriptMode,
  babel: setupJavascriptMode,
  typescript: setupTypescriptMode,
  typescriptreact: setupTsxMode,
};

const Editor = ({ language, value, onChange }) => {
  const divEl = useRef(null);
  const editor = useRef(null);

  const handleChange = useCallback(debounce(onChange, 200), []);
  useEffect(() => {
    if (divEl.current) {
      editor.current = monaco.editor.create(divEl.current, {
        minimap: { enabled: false },
        theme: "vs-dark",
      });
    }

    setupKeybindings(editor.current);
    editor.current.onDidChangeModelContent(() => {
      //console.log(editor.current.getValue());
      handleChange(editor.current.getValue());
    });
    return () => {
      editor.current.dispose();
      const model = editor.current.getModel();
      if (model) {
        model.dispose();
      }
    };
  }, [handleChange]);

  useEffect(() => {
    const model = editor.current.getModel();
    model.dispose();
    editor.current.setModel(modes[language](value));
  }, [language, value]);

  useEffect(() => {
    editor.current.setValue(value);
  }, [value]);

  useEffect(() => {
    const observer = new ResizeObserver(() => {
      window.setTimeout(() => editor.current.layout(), 0);
    });
    observer.observe(divEl.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  return <div className="relative flex-auto" ref={divEl}></div>;
};

export default Editor;
