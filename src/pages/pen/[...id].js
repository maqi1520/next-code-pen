import React, { useCallback, useEffect, useRef, useState } from "react";
import Error from "next/error";
import Head from "next/head";
import { Editor } from "../../components/Editor";
import Preview from "../../components/Preview";
import Header from "../../components/header";
import LayoutSwitch from "../../components/header/LayoutSwitch";
import Select from "../../components/select";
import SplitPane from "react-split-pane";
import { useDebounce } from "react-use";
import Worker from "worker-loader!../../workers/compile.worker.js";
import { requestResponse } from "../../utils/workers";
import { compileScss } from "../../utils/compile";
import { get } from "../../utils/database";
import Modal from "../../components/setting/Modal";
import SaveBtn from "../../components/header/SaveBtn";

function Pen({
  id = "",
  initialContent = {
    html: "",
    css: "",
    js: "",
    scripts: [],
    styles: [],
    cssLang: "css",
    jsLang: "babel",
    htmlLang: "html",
  },
}) {
  const [state, setState] = useState(initialContent);
  const { html, htmlLang, css, cssLang, js, jsLang, name, styles, scripts } =
    state;
  const setCssLang = (cssLang) => setState((prev) => ({ ...prev, cssLang }));
  const setJsLang = (jsLang) => setState((prev) => ({ ...prev, jsLang }));
  const setHtmlLang = (htmlLang) => setState((prev) => ({ ...prev, htmlLang }));
  const setBase = (base) => setState((prev) => ({ ...prev, ...base }));

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
    previewRef.current.contentWindow.postMessage(content, "*");
  };

  const compileNow = async (content) => {
    let { canceled, error, ...other } = await requestResponse(
      worker.current,
      content
    );
    if (content.cssLang === "scss") {
      try {
        other.css = await compileScss(content.css);
      } catch (error) {
        other.css = undefined;
      }
    }

    if (canceled) {
      return;
    }

    inject(other);
  };

  const [, cancel] = useDebounce(
    () => {
      compileNow(state);
    },
    1000,
    [state]
  );

  const handleChangeHtml = (value) => {
    setState((prev) => ({ ...prev, html: value }));
  };

  const handleChangeCss = (value) => {
    setState((prev) => ({ ...prev, css: value }));
  };
  const handleChangeJs = (value) => {
    setState((prev) => ({ ...prev, js: value }));
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
          defaultValue={html}
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
            defaultValue={css}
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
            defaultValue={js}
            onChange={handleChangeJs}
            language={jsLang}
          ></Editor>
        </div>
      </SplitPane>
    </SplitPane>,

    <div key="2" className="bg-red-50 h-full overflow-hidden">
      <Preview
        styles={styles}
        scripts={scripts}
        ref={previewRef}
        iframeClassName={""}
        onLoad={() => {
          inject({
            html,
          });
        }}
      />
    </div>,
  ];

  return (
    <div className="h-screen flex flex-col">
      <Header>
        <Modal
          name={name}
          styles={styles}
          scripts={scripts}
          onChange={setBase}
        />
        <LayoutSwitch value={layout} onChange={setLayout} />
        <SaveBtn data={state}></SaveBtn>
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

export default function Page({ errorCode, ...props }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    setVisible(true);
  }, []);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  return (
    <>
      <Head>
        <meta property="og:url" content={`https://code.runjs.cool`} />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content={`https://code.runjs.cool/api/thumbnail?path=/preview/${props._id}`}
        />
        <meta
          property="og:image"
          content={`https://code.runjs.cool/api/thumbnail?path=/preview/${props._id}`}
        />
      </Head>
      {visible ? <Pen {...props} /> : null}
    </>
  );
}

export async function getServerSideProps({ params, res, query }) {
  if (params.id.length !== 1) {
    return {
      props: {
        errorCode: 404,
      },
    };
  }
  if (params.id && params.id[0] === "create") {
    res.setHeader(
      "cache-control",
      "public, max-age=0, must-revalidate, s-maxage=31536000"
    );
    return {
      props: {},
    };
  } else {
    try {
      const initialContent = await get({
        id: params.id[0],
      });

      res.setHeader(
        "cache-control",
        "public, max-age=0, must-revalidate, s-maxage=31536000"
      );

      return {
        props: {
          id: params.id[0],
          initialContent,
        },
      };
    } catch (error) {
      return {
        props: {
          errorCode: error.status || 500,
        },
      };
    }
  }
}
