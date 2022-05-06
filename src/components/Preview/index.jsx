import { forwardRef, useMemo, useState } from "react";
import clsx from "clsx";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

export default forwardRef(function Preview(
  { onLoad, iframeClassName = "", scripts, styles },
  ref
) {
  const [resizing, setResizing] = useState();
  useIsomorphicLayoutEffect(() => {
    function onMouseMove(e) {
      e.preventDefault();
      setResizing(true);
    }
    function onMouseUp(e) {
      e.preventDefault();
      setResizing();
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  const scriptsdom = scripts
    .map((s) => {
      if (s.trim() !== "") {
        return `<script charset="utf-8" src="${s}" crossorigin="anonymous"></script>`;
      } else {
        return false;
      }
    })
    .filter(Boolean)
    .join("");
  const stylessdom = styles
    .map((s) => {
      if (s.trim() !== "") {
        return `<link rel="stylesheet" href="${s}">`;
      } else {
        return false;
      }
    })
    .filter(Boolean)
    .join("");

  const srcDoc = `<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />${stylessdom}<style id="_style"></style>
      <script>
        var hasHtml = false;
        var hasCss = false;
        var hasjs = false;
        var visible = false;
        var scripts = [];
        window.addEventListener("message", (e) => {
          if (typeof e.data.clear !== "undefined") {
            setHtml();
            setCss();
            checkVisibility();
            return;
          }
          if (typeof e.data.css !== "undefined") {
            setCss(e.data.css);
          }
          if (typeof e.data.html !== "undefined") {
            setHtml(e.data.html);
          }
          if (typeof e.data.js !== "undefined") {
            setScript(e.data.js);
          }
          checkVisibility();
        });
        function checkVisibility() {
          if ((!visible && hasHtml) || hasCss || hasjs) {
            visible = true;
            document.body.style.display = "";
          } else if (visible && (!hasHtml || !hasCss)) {
            visible = false;
            document.body.style.display = "none";
          }
        }
        function setHtml(html) {
          if (typeof html === "undefined") {
            document.body.innerHTML = "";
            hasHtml = false;
          } else {
            document.body.innerHTML = html;
            hasHtml = true;
          }
        }
        function setCss(css) {
          const style = document.getElementById("_style");
          const newStyle = document.createElement("style");
          newStyle.id = "_style";
          newStyle.innerHTML = typeof css === "undefined" ? "" : css;
          style.parentNode.replaceChild(newStyle, style);
          hasCss = typeof css === "undefined" ? false : true;
        }
        function setScript(js) {
          const script = document.getElementById("_script");
          const newScript = document.createElement("script");
          newScript.id = "_script";
          newScript.innerHTML =
            typeof js === "undefined"
              ? ""
              : js;
  
          if (script) {
            script.parentNode.replaceChild(newScript, script);
          } else {
            document.body.appendChild(newScript);
          }
  
          hasjs = typeof js === "undefined" ? false : true;
        }
      </script>
    </head>
    <body style="display: none">${scriptsdom}<script id="_script"></script></body>
    <script>
      // https://github.com/sveltejs/svelte-repl/blob/master/src/Output/srcdoc/index.html
      // https://github.com/sveltejs/svelte-repl/blob/master/LICENSE
      document.body.addEventListener("click", (event) => {
        if (event.which !== 1) return;
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        if (event.defaultPrevented) return;
  
        // ensure target is a link
        let el = event.target;
        while (el && el.nodeName !== "A") el = el.parentNode;
        if (!el || el.nodeName !== "A") return;
  
        if (
          el.hasAttribute("download") ||
          el.getAttribute("rel") === "external" ||
          el.target
        )
          return;
  
        event.preventDefault();
        window.open(el.href, "_blank");
      });
    </script>
  </html>
  `;

  return (
    <iframe
      ref={ref}
      onLoad={onLoad}
      title="Preview"
      className={clsx(
        iframeClassName,
        "absolute inset-0 w-full h-full bg-white",
        {
          "pointer-events-none select-none": resizing,
        }
      )}
      sandbox="allow-modals allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts"
      srcDoc={srcDoc}
    />
  );
});
