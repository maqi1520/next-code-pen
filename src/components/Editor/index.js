import dynamic from "next/dynamic";
import isMobile from "is-mobile";
const EditorMobile = dynamic(() => import("../codemirror"), {
  ssr: false,
});

const EditorDesktop = dynamic(() => import("./EditorDesktop"), {
  ssr: false,
});

export const Editor = isMobile() ? EditorMobile : EditorDesktop;
