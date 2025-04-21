import * as React from "react";
import type { SVGProps } from "react";
const SvgPreview = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    role="img"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fillRule="evenodd"
      d="M21.005 25.01a1 1 0 1 1 0 2h-10a1 1 0 1 1 0-2zm7-3a2 2 0 0 1-2 2h-20a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2zm-6.776-6.947-8-4a.5.5 0 0 0-.724.447v8a.5.5 0 0 0 .724.448l8-4a.5.5 0 0 0 0-.895"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgPreview;
