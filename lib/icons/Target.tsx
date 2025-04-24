import * as React from "react";
import type { SVGProps } from "react";
const SvgTarget = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.008 28c-6.628 0-12-5.373-12-12s5.372-12 12-12c6.627 0 12 5.373 12 12s-5.373 12-12 12m0-21a9 9 0 1 0 9 9 9 9 0 0 0-9-9m0 16a7 7 0 1 1 7-7 7 7 0 0 1-7 7m0-11a4 4 0 1 0 4 4 4 4 0 0 0-4-4m0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgTarget;
