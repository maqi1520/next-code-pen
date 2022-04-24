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

  let script;
  let css;
  let html;

  console.log(event.data.script);

  try {
    if (event.data.script) {
      const res = Babel.transform(event.data.script.value, {
        presets: [event.data.script.transformer],
      });
      script = res.code;
    }
    if (event.data.css) {
      css = event.data.css.value;
    }
    if (event.data.script) {
      html = event.data.html.value;
    }

    respond({
      css,
      html,
      script,
    });
  } catch (error) {
    console.log(error);
    respond({
      error: {
        message: error,
        file: "JS",
      },
    });
  }
});
