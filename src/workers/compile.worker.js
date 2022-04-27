import * as Babel from "@babel/standalone";

let current;

// eslint-disable-next-line no-restricted-globals
addEventListener("message", async (event) => {
  current = event.data._id;

  function respond(data) {
    setTimeout(() => {
      if (event.data._id === current) {
        postMessage({ _id: event.data._id, ...data });
      } else {
        postMessage({ _id: event.data._id, canceled: true });
      }
    }, 0);
  }

  let js;
  let css;
  let html;

  console.log(event.data);

  if (event.data.js) {
    if (event.data.jsLang === "javascript") {
      js = event.data.js;
    }
    if (event.data.jsLang === "babel") {
      const res = Babel.transform(event.data.js, {
        presets: ["react"],
      });
      js = res.code;
    }
    if (event.data.jsLang === "typescript") {
      const res = Babel.transform(event.data.js, {
        presets: ["typescript"],
      });
      js = res.code;
    }
  }
  if (event.data.css) {
    css = event.data.css;
  }
  if (event.data.html) {
    html = event.data.html;
  }

  respond({
    css,
    html,
    js,
  });
});
