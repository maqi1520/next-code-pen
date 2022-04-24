import { useRef, useEffect, useState } from "react";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";
import CodeMirror from "codemirror";
import { onDidChangeTheme, getTheme } from "../../utils/theme";
require("codemirror/mode/htmlmixed/htmlmixed");
require("codemirror/mode/javascript/javascript");
require("codemirror/mode/css/css");

const docToMode = {
  html: "htmlmixed",
  css: "css",
  javascript: "javascript",
};

const modeToDoc = {
  htmlmixed: "html",
  css: "css",
  javascript: "javascript",
};

export default function EditorMobile({
  language,
  value,
  onChange,
  editorRef: inRef,
}) {
  const ref = useRef();
  const cmRef = useRef();
  const [i, setI] = useState(0);
  const skipNextOnChange = useRef(true);

  useEffect(() => {
    cmRef.current = CodeMirror(ref.current, {
      value,
      mode: docToMode[language],
      lineNumbers: true,
      viewportMargin: Infinity,
      tabSize: 2,
      theme: "dark",
      addModeClass: true,
    });
    typeof inRef === "function" &&
      inRef({
        getValue(doc) {
          return content.current[doc];
        },
      });
  }, []);

  useEffect(() => {
    function handleChange() {
      onChange(cmRef.current.getValue());
    }
    cmRef.current.on("change", handleChange);
    return () => {
      cmRef.current.off("change", handleChange);
    };
  }, [onChange]);

  useEffect(() => {
    cmRef.current.setOption("mode", docToMode[language]);
  }, [language]);

  useIsomorphicLayoutEffect(() => {
    if (!cmRef.current) return;
    cmRef.current.refresh();
    //cmRef.current.focus();
  }, [i]);

  useEffect(() => {
    function handleThemeChange(theme) {
      cmRef.current.setOption("theme", theme);
    }
    const dispose = onDidChangeTheme(handleThemeChange);
    return () => dispose();
  }, []);

  return (
    <div className="relative flex-auto">
      <div ref={ref} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
