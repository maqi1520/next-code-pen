import React, { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "../../components/Editor";
import Preview from "../../components/Preview";
import SplitPane from "react-split-pane";
import Worker from "worker-loader!../../workers/compile.worker.js";
import { requestResponse } from "../../utils/workers";

const initialContent = {
  css: {
    value: `body{
      color:red;
    }`,
    language: "css",
    transformer: "css",
  },
  html: {
    value: `
    <div id="app"></div>
    `,
    language: "html",
    transformer: "html",
  },
  script: {
    value: `class App extends React.Component {
      state = {
        count: 0
      }
    
      inc = () => this.setState({
        count: this.state.count + 1
      })
    
      dec = () => this.setState({
        count: this.state.count - 1
      })
    
      render() {
        return (
          <div>
            <h2>{ this.state.count }</h2>
            <button onClick={this.inc}>Increment</button>
            <button onClick={this.dec}>Decrement</button>
          </div>
        )
      }
    }
    
    ReactDOM.render(<App />, document.getElementById('app'))
    
    `,
    language: "typescript",
    transformer: "react",
  },
};

export default function Pen() {
  const previewRef = useRef();
  const [visible, setVisible] = useState(false);
  const worker = useRef();
  useEffect(() => {
    setVisible(true);
  }, []);

  useEffect(() => {
    worker.current = new Worker();
    return () => {
      worker.current.terminate();
    };
  }, []);

  async function compileNow(content) {
    let { css, html, script, canceled, error } = await requestResponse(
      worker.current,
      content
    );

    if (canceled) {
      return;
    }

    inject({
      css,
      html,
      script,
    });
  }

  const inject = useCallback(async (content) => {
    previewRef.current.contentWindow.postMessage(content, "*");
  }, []);

  const handleChangeHtml = useCallback((html) => {
    compileNow({
      html: {
        ...initialContent.html,

        value: html,
      },
    });
  }, []);
  const handleChangeCss = useCallback((css) => {
    compileNow({
      css: {
        ...initialContent.css,

        value: css,
      },
    });
  }, []);
  const handleChangeScript = useCallback((script) => {
    compileNow({
      script: {
        ...initialContent.script,
        value: `try {
          ${script}
        } catch (err) {
          console.error('js代码运行出错')
          console.error(err)
        }
    `,
      },
    });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <div className="h-16 flex-none bg-[#181818] border-b border-gray-700">
        111
      </div>

      <div className="flex-auto flex relative">
        <SplitPane defaultSize="50%" split="vertical">
          <SplitPane split="horizontal" defaultSize="33%">
            <div className="overflow-hidden flex flex-col w-full">
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
                value={initialContent.html.value}
                onChange={handleChangeHtml}
                language={initialContent.html.language}
              ></Editor>
            </div>
            <SplitPane split="horizontal" defaultSize="50%">
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
                </div>
                <Editor
                  value={initialContent.css.value}
                  onChange={handleChangeCss}
                  language={initialContent.css.language}
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
                </div>
                <Editor
                  value={initialContent.script.value}
                  onChange={handleChangeScript}
                  language={initialContent.script.language}
                ></Editor>
              </div>
            </SplitPane>
          </SplitPane>

          <div className="bg-red-50 h-full overflow-hidden">
            {visible && (
              <Preview
                ref={previewRef}
                iframeClassName={""}
                onLoad={() => {
                  setTimeout(() => {
                    inject({
                      html: initialContent.html,
                    });
                    compileNow({
                      css: initialContent.css,
                      script: initialContent.script,
                      html: initialContent.html,
                    });
                  }, 200);
                }}
              />
            )}
          </div>
        </SplitPane>
      </div>
    </div>
  );
}
