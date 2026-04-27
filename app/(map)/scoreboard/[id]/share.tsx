"use client";
import { useClipboard } from "use-clipboard-copy";
import SvgShare from "@/lib/icons/Share";

export function ShareButton({ url }: { url: string }) {
  const clipboard = useClipboard();
  const isShareAvailable: boolean =
    typeof navigator !== "undefined"
      ? typeof navigator?.share === "function"
      : false;

  return (
    <button
      className="action-button flex cursor-pointer items-center justify-center gap-2 py-1.5 font-semibold font-sans text-base"
      onClick={() => {
        if (isShareAvailable) {
          navigator.share({ url: window.location.toString() || url });
        } else {
          clipboard.copy(window.location.toString() || url);
        }
      }}
      type="button"
    >
      <SvgShare className="text-neutral-600" height={24} width={24} />
      {isShareAvailable ? "Share link" : "Copy link"}
    </button>
  );
}
