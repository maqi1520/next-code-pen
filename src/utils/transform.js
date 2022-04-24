import { transformers } from "./transformer";

const defaultPresets = [
  [
    "es2015",
    {
      modules: false,
    },
  ],
  "es2016",
  "es2017",
  "stage-0",
];

export async function js({ code, transformer }) {
  if (transformer === "js") {
    return code;
  } else if (
    transformer === "babel" ||
    transformer === "jsx" /* @deprecated, use "babel" */
  ) {
    return window.Babel.transform(code, {
      presets: [...defaultPresets, "flow", "react"],
    }).code;
  } else if (transformer === "typescript") {
    const res = window.typescript.transpileModule(code, {
      fileName: "/foo.ts",
      reportDiagnostics: true,
      compilerOptions: {
        module: "es2015",
      },
    });
    return res.outputText;
  } else if (transformer === "vue-jsx") {
    return window.Babel.transform(code, {
      presets: [...defaultPresets, "flow", transformers.get("VuePreset")],
    }).code.replace(
      /import [^\s]+ from ['"]babel-helper-vue-jsx-merge-props['"];?/,
      transformers.get("VueJSXMergeProps")
    );
  }
  throw new Error(`Unknow transformer: ${transformer}`);
}

export async function html({ code, transformer }) {
  if (transformer === "html") {
    return code;
  } else if (transformer === "pug") {
    return window.pug.render(code);
  }
  throw new Error(`Unknow transformer: ${transformer}`);
}

export async function css({ code, transformer }) {
  switch (transformer) {
    case "css":
      return code;
    case "less":
      return transformers
        .get("less")
        .render(code)
        .then((res) => res.css);
    case "scss":
    case "sass":
      return new Promise((resolve, reject) => {
        transformers.get("sass").compile(
          code,
          {
            indentedSyntax: transformer === "sass",
          },
          (result) => {
            if (result.status === 0) return resolve(result.text);
            reject(new Error(result.formatted));
          }
        );
      });
    case "stylus":
      return new Promise((resolve, reject) => {
        window.stylus.render(code, { filename: "codepan.styl" }, (err, css) => {
          if (err) return reject(err);
          resolve(css);
        });
      });
    default:
      throw new Error(`Unknow transformer: ${transformer}`);
  }
}
