import * as React from "react";
import type { SVGProps } from "react";
const SvgZoomOut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    role="img"
    {...props}
  >
    <path
      fill=""
      fillRule="evenodd"
      d="m24.494 27.263-4.339-5.128a9.526 9.526 0 1 1 1.974-1.974l5.129 4.338a1.96 1.96 0 1 1-2.764 2.764M14.505 7.01a7.5 7.5 0 1 0 7.5 7.5 7.5 7.5 0 0 0-7.5-7.5m-4 8.5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgZoomOut;
