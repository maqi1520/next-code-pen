import progress from "nprogress";
import loadjs from "loadjs";
import pify from "pify";

function asyncLoad(resources, name) {
  return new Promise((resolve, reject) => {
    if (loadjs.isDefined(name)) {
      resolve();
    } else {
      loadjs(resources, name, {
        success() {
          resolve();
        },
        error() {
          progress.done();
          reject(new Error("network error"));
        },
      });
    }
  });
}

class Transformers {
  constructor() {
    this.map = {};
  }

  set(k, v) {
    this.map[k] = v;
  }

  get(k) {
    return this.map[k];
  }
}

const transformers = new Transformers();

async function loadBabel() {
  if (loadjs.isDefined("babel")) return;

  progress.start();
  const [, VuePreset] = await Promise.all([
    asyncLoad(process.env.BABEL_CDN, "babel"),
    import(
      /* webpackChunkName: "babel-stuffs" */ "babel-preset-vue/dist/babel-preset-vue"
    ),
  ]);
  transformers.set("VuePreset", VuePreset);
  transformers.set("VueJSXMergeProps", VueJSXMergeProps);
  progress.done();
}

async function loadPug() {
  if (loadjs.isDefined("pug")) return;

  progress.start();
  await Promise.all([asyncLoad(process.env.PUG_CDN, "pug")]);
  progress.done();
}

async function loadLess() {
  if (!transformers.get("less")) {
    progress.start();
    const less = await import("less");
    transformers.set("less", pify(less));
    progress.done();
  }
}

async function loadSass() {
  if (!transformers.get("sass")) {
    progress.start();
    const [Sass] = await Promise.all([
      import("../../static/vendor/sass/sass"),
      import(
        /* webpackChunkName: "codemirror-mode" */ "codemirror/mode/sass/sass.js"
      ),
    ]);
    Sass.setWorkerUrl("/vendor/sass/sass.worker.js");
    transformers.set("sass", new Sass());
    progress.done();
  }
}

async function loadTypescript() {
  if (loadjs.isDefined("typescript")) return;

  progress.start();
  await asyncLoad([process.env.TYPESCRIPT_CDN], "typescript");
  progress.done();
}

async function loadStylus() {
  if (loadjs.isDefined("stylus")) return;

  progress.start();
  await Promise.all([
    import(
      /* webpackChunkName: "codemirror-mode" */ "codemirror/mode/stylus/stylus"
    ),
    asyncLoad("/vendor/stylus.js", "stylus"),
  ]);
  progress.done();
}

export {
  loadBabel,
  loadPug,
  transformers,
  loadLess,
  loadSass,
  loadTypescript,
  loadStylus,
};
