import React, { useEffect, useRef } from "react";
import Head from "next/head";
import Error from "next/error";
import Preview from "../../components/Preview";
import Worker from "worker-loader!../../workers/compile.worker.js";
import { requestResponse } from "../../utils/workers";
import { compileScss } from "../../utils/compile";
import { get } from "../../utils/database";

export default function Page({
  id = "",
  errorCode,
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
  const previewRef = useRef();
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

  useEffect(() => {
    compileNow(initialContent);
  }, [initialContent]);

  if (errorCode) {
    return <Error statusCode={errorCode} />;
  }
  return (
    <div className="h-screen flex flex-col">
      <Head>
        <meta property="og:url" content={`https://code.runjs.cool`} />
        <meta name="twitter:card" content="summary" />
        <meta
          name="twitter:image"
          content={`https://code.runjs.cool/api/thumbnail?path=/preview/${id}`}
        />
        <meta
          property="og:image"
          content={`https://code.runjs.cool/api/thumbnail?path=/preview/${id}`}
        />
      </Head>
      <Preview
        styles={initialContent.styles}
        scripts={initialContent.scripts}
        ref={previewRef}
        iframeClassName={""}
        onLoad={() => {
          inject({
            html: initialContent.html,
          });
        }}
      />
    </div>
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
