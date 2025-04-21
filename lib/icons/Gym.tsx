import * as React from "react";
import type { SVGProps } from "react";
const SvgGym = (props: SVGProps<SVGSVGElement>) => (
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
      d="M29 17.5v4a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v4a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1M25 24h-1a1 1 0 0 1-1-1v-5.5H9V23a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v5.5h14V9a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1M4.5 22h-1a.5.5 0 0 1-.5-.5v-4a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1v-4a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgGym;
