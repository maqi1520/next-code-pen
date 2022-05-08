import "../styles/globals.css";
import Head from "next/head";

const TITLE = "Code Editor | 一个纯前端的在线代码实时预览工具";
const DESCRIPTION =
  "一个纯前端的在线代码实时预览工具,支持 Less Scss JavaScript Typescript";
const FAVICON_VERSION = 1;

function v(href) {
  return `${href}?v=${FAVICON_VERSION}`;
}

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={v("/favicons/apple-touch-icon.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={v("/favicons/favicon-32x32.png")}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={v("/favicons/favicon-16x16.png")}
        />
        <link rel="manifest" href={v("/favicons/site.webmanifest")} />
        <link rel="shortcut icon" href={v("/favicons/favicon.ico")} />
        <meta name="apple-mobile-web-app-title" content="Code Editor" />
        <meta name="application-name" content="Code Editor" />
        <meta name="msapplication-TileColor" content="#38bdf8" />
        <meta name="theme-color" content="#ffffff" />

        <title>{TITLE}</title>
        <meta content={DESCRIPTION} name="description" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
