import dynamic from "next/dynamic";
// const EditorMobile = dynamic(() => import("../codemirror"), {
//   ssr: false,
// });

const EditorDesktop = dynamic(() => import("./EditorDesktop"), {
  ssr: false,
});

export const Editor = EditorDesktop;
