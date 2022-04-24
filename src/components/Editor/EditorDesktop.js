import React, { useRef, useEffect, useCallback } from "react";
import * as monaco from "monaco-editor";
import debounce from "debounce";

window.MonacoEnvironment = {
  getWorkerUrl: (_moduleId, label) => {
    const v = `?v=${
      require("monaco-editor/package.json?fields=version").version
    }`;
    if (label === "css" || label === "tailwindcss")
      return `/_next/static/css.worker.js${v}`;
    if (label === "html") return `/_next/static/html.worker.js${v}`;
    if (label === "typescript" || label === "javascript")
      return `/_next/static/ts.worker.js${v}`;
    return `/_next/static/editor.worker.js${v}`;
  },
};

const Editor = ({ language, value, onChange }) => {
  console.log(value);
  const divEl = useRef(null);
  const editor = useRef(null);

  const handleChange = useCallback(debounce(onChange, 200), []);
  useEffect(() => {
    if (divEl.current) {
      editor.current = monaco.editor.create(divEl.current, {
        value,
        minimap: { enabled: false },
        theme: "vs-dark",
        language,
      });
    }
    editor.current.onDidChangeModelContent(() => {
      //console.log(editor.current.getValue());
      handleChange(editor.current.getValue());
    });
    return () => {
      editor.current.dispose();
    };
  }, [handleChange]);

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

export default React.memo(Editor);
