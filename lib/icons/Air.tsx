import * as React from "react";
import type { SVGProps } from "react";
const SvgAir = (props: SVGProps<SVGSVGElement>) => (
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
      d="M9.01 7.51a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3"
      clipRule="evenodd"
    />
    <path
      fill=""
      d="M6.01 17.51a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m3 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m7 3a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m5.5-1.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m3-7a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m-8.5-11.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m7 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"
    />
  </svg>
);
export default SvgAir;
