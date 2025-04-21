import * as React from "react";
import type { SVGProps } from "react";
const SvgChurch = (props: SVGProps<SVGSVGElement>) => (
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
      d="M4 18v8a1 1 0 0 0 1 1h22a1 1 0 0 0 1-1v-8h.5a.5.5 0 0 0 .5-.5c0-.331-.053-.66-.158-.975l-.614-1.841a1 1 0 0 0-.949-.684H22v-1.532a1 1 0 0 0-.36-.768l-4.28-3.567a1 1 0 0 1-.36-.768V5.25a.25.25 0 0 1 .25-.25h1.25a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5h-1.25a.25.25 0 0 1-.25-.25V1.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.25a.25.25 0 0 1-.25.25H13.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1.25a.25.25 0 0 1 .25.25v2.115a1 1 0 0 1-.36.768L10.36 11.7a1 1 0 0 0-.36.768V14H4.72a1 1 0 0 0-.948.684l-.614 1.842A3.1 3.1 0 0 0 3 17.5a.5.5 0 0 0 .5.5zm12-6a3 3 0 1 1-3 3 3 3 0 0 1 3-3m-3.5 8h7a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-4a.5.5 0 0 1 .5-.5"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgChurch;
