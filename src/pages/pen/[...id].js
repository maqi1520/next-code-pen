import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "../../components/Editor";
import Preview from "../../components/Preview";
import Header from "../../components/header";
import LayoutSwitch from "../../components/header/LayoutSwitch";
import Select from "../../components/select";
import SplitPane from "react-split-pane";
import Worker from "worker-loader!../../workers/compile.worker.js";
import { requestResponse } from "../../utils/workers";
import { useLocalStorage } from "react-use";
function Pen() {
  const [htmlLang, setHtmlLang] = useLocalStorage("htmlLang", "html");
  const [cssLang, setCssLang] = useLocalStorage("cssLang", "css");
  const [jsLang, setJsLang] = useLocalStorage("jsLang", "babel");
  const [html, setHtml] = useLocalStorage("html", `<div id="app"></div>`);
  const [css, setCss] = useLocalStorage(
    "css",
    `body{
    color:red;
  }`
  );
  const [js, setJs] = useLocalStorage(
    "js",
    `
  function App() {
    const [count, setCount] = React.useState(0)
  
    const inc = () => setCount(count + 1)
  
    const dec = () => setCount(count - 1)
  
    return (
      <div>
        <h2>{count}</h2>
        <button onClick={inc}>Increment</button>
        <button onClick={dec}>Decrement</button>
      </div>
    )
  }
  
  ReactDOM.render(<App />, document.getElementById('app'))
  `
  );
  const previewRef = useRef();
  const [layout, setLayout] = useState("left");
  const worker = useRef();

  useEffect(() => {
    worker.current = new Worker();
    return () => {
      worker.current.terminate();
    };
  }, []);

  const inject = async (content) => {
    console.log(content);
    previewRef.current.contentWindow.postMessage(content, "*");
  };

  const compileNow = async (content) => {
    console.log(jsLang);
    let { canceled, error, ...other } = await requestResponse(worker.current, {
      html,
      css,
      js,
      htmlLang,
      cssLang,
      jsLang,
      ...content,
    });

    if (canceled) {
      return;
    }

    inject(other);
  };

  const handleChangeHtml = (value) => {
    compileNow({
      html: value,
    });
  };

  const handleChangeCss = (value) => {
    compileNow({
      css: value,
    });
  };
  const handleChangeJs = (value) => {
    compileNow({
      js: value,
    });
  };

  const panes = [
    <SplitPane
      key="1"
      split={layout == "top" ? "vertical" : "horizontal"}
      defaultSize="33%"
    >
      <div className="overflow-hidden flex flex-col w-full h-full">
        <div className="h-10 flex-none bg-[#181818] text-gray-50 px-4 py-2 font-medium text-sm border-gray-800 border-b flex items-center justify-start">
          <svg viewBox="0 0 15 15" className="w-4 h-4 mr-1">
            <rect fill="#FF3C41" width="15" height="15" rx="4"></rect>
            <path
              d="M10.97 2.29a.563.563 0 0 0-.495-.29.572.572 0 0 0-.488.277l-5.905 9.86a.565.565 0 0 0-.007.574c.102.18.287.289.495.289a.572.572 0 0 0 .488-.277l5.905-9.86a.565.565 0 0 0 .007-.574"
              fill="#28282B"
            ></path>
          </svg>
          HTML
        </div>
        <Editor
          value={html}
          onChange={handleChangeHtml}
          language={htmlLang}
        ></Editor>
      </div>
      <SplitPane
        split={layout == "top" ? "vertical" : "horizontal"}
        defaultSize="50%"
      >
        <div className="overflow-hidden flex flex-col  h-full w-full">
          <div className="h-10 flex-none bg-[#181818] text-gray-50 px-4 py-2 font-medium   text-sm border-gray-800 border-b flex items-center justify-start">
            <svg viewBox="0 0 15 15" className="w-4 h-4 mr-1">
              <rect fill="#0EBEFF" width="15" height="15" rx="4"></rect>
              <path
                d="M8 8.366l1.845 1.065a.507.507 0 0 0 .686-.181.507.507 0 0 0-.186-.685L8.5 7.5l1.845-1.065a.507.507 0 0 0 .186-.685.507.507 0 0 0-.686-.181L8 6.634v-2.13A.507.507 0 0 0 7.5 4c-.268 0-.5.225-.5.503v2.131L5.155 5.569a.507.507 0 0 0-.686.181.507.507 0 0 0 .186.685L6.5 7.5 4.655 8.565a.507.507 0 0 0-.186.685c.134.232.445.32.686.181L7 8.366v2.13c0 .271.224.504.5.504.268 0 .5-.225.5-.503V8.366z"
                fill="#282828"
              ></path>
            </svg>
            CSS
            <Select
              value={cssLang}
              onChange={setCssLang}
              options={["css", "less", "scss"]}
            />
          </div>
          <Editor
            value={css}
            onChange={handleChangeCss}
            language={cssLang}
          ></Editor>
        </div>
        <div className="overflow-hidden flex flex-col h-full">
          <div className="h-10 flex-none bg-[#181818] text-gray-50 px-4 py-2 font-medium text-sm border-gray-800  border-b flex items-center justify-start">
            <svg viewBox="0 0 15 15" className="w-4 h-4 mr-1">
              <rect fill="#FCD000" width="15" height="15" rx="4"></rect>
              <path
                d="M6.554 3.705c0 .267-.19.496-.452.543-1.2.217-2.12 1.61-2.12 3.275 0 1.665.92 3.057 2.12 3.274a.554.554 0 0 1-.205 1.087c-1.733-.322-3.022-2.175-3.022-4.361 0-2.187 1.289-4.04 3.022-4.362a.554.554 0 0 1 .657.544zm1.892 0c0-.347.316-.607.657-.544 1.733.322 3.022 2.175 3.022 4.362 0 2.186-1.289 4.04-3.022 4.361a.554.554 0 0 1-.205-1.087c1.2-.217 2.12-1.61 2.12-3.274 0-1.665-.92-3.058-2.12-3.275a.551.551 0 0 1-.452-.543z"
                fill="#282828"
              ></path>
            </svg>
            JS
            <Select
              value={jsLang}
              onChange={setJsLang}
              options={["javascript", "babel", "typescript"]}
            />
          </div>
          <Editor
            value={js}
            onChange={handleChangeJs}
            language={jsLang}
          ></Editor>
        </div>
      </SplitPane>
    </SplitPane>,

    <div key="2" className="bg-red-50 h-full overflow-hidden">
      <Preview
        ref={previewRef}
        iframeClassName={""}
        onLoad={() => {
          inject({
            html,
          });
          compileNow({
            css,
            js,
            html,
          });
        }}
      />
    </div>,
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header>
        <LayoutSwitch value={layout} onChange={setLayout} />
      </Header>

      <div className="flex-auto flex relative">
        <SplitPane
          primary="second"
          defaultSize="50%"
          split={layout == "top" ? "horizontal" : "vertical"}
        >
          {layout === "left"
            ? panes.map((p) => p)
            : panes.reverse().map((p) => p)}
        </SplitPane>
      </div>
    </div>
  );
}

export default function Page() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  if (visible) {
    return <Pen />;
  }
  return null;
}
