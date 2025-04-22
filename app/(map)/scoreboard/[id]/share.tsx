"use client";
import SvgShare from "@/lib/icons/Share";
import { useClipboard } from "use-clipboard-copy";

export function ShareButton({ url }: { url: string }) {
  const clipboard = useClipboard();
  const isShareAvailable: boolean =
    typeof navigator !== "undefined"
      ? typeof navigator?.share === "function"
      : false;

  return (
    <button
      className="action-button cursor-pointer font-sans font-medium text-base py-1.5 gap-2 flex items-center justify-center"
      onClick={() => {
        if (isShareAvailable) {
          navigator.share({ url: window.location.toString() || url });
        } else {
          clipboard.copy(window.location.toString() || url);
        }
      }}
    >
      <SvgShare width={24} height={24} className="text-neutral-600" />
      {isShareAvailable ? "Share link" : "Copy link"}
    </button>
  );
}
