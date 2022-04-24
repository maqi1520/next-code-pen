import { forwardRef, useState } from "react";
import clsx from "clsx";
import { useIsomorphicLayoutEffect } from "../../hooks/useIsomorphicLayoutEffect";

export default forwardRef(function Preview(
  { onLoad, iframeClassName = "" },
  ref
) {
  const [resizing, setResizing] = useState();
  useIsomorphicLayoutEffect(() => {
    function onMouseMove(e) {
      e.preventDefault();
      setResizing(true);
    }
    function onMouseUp(e) {
      e.preventDefault();
      setResizing();
    }
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onMouseMove);
    window.addEventListener("touchend", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onMouseMove);
      window.removeEventListener("touchend", onMouseUp);
    };
  }, []);

  return (
    <iframe
      ref={ref}
      onLoad={onLoad}
      title="Preview"
      className={clsx(
        iframeClassName,
        "absolute inset-0 w-full h-full bg-white",
        {
          "pointer-events-none select-none": resizing,
        }
      )}
      sandbox="allow-popups-to-escape-sandbox allow-scripts allow-popups allow-forms allow-pointer-lock allow-top-navigation allow-modals"
      src="/frame.html"
    />
  );
});
