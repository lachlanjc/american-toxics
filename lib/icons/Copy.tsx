import * as React from "react";
import type { SVGProps } from "react";
const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
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
      d="M20.51 28.012h-13a1.5 1.5 0 0 1-1.5-1.5v-17a1.5 1.5 0 0 1 1.5-1.5h3.5v14.5a2.5 2.5 0 0 0 2.5 2.5h8.5v1.5a1.5 1.5 0 0 1-1.5 1.5m1-17a.5.5 0 0 1-.5-.5V5.219a.5.5 0 0 1 .854-.354l5.293 5.293a.5.5 0 0 1-.354.854zm6.5 2.5v9a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.5-1.5v-17a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 1 1.5 1.5"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCopy;
