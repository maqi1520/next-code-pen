import Sass from "sass.js/dist/sass";
Sass.setWorkerUrl("/vendor/sass.worker.js");

export function compileScss(code) {
  const sass = new Sass();
  return new Promise((resolve, reject) => {
    sass.compile(code, (result) => {
      if (result.status === 0) return resolve(result.text);
      reject(new Error(result.formatted));
    });
  });
}
