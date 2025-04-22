import * as React from "react";
import type { SVGProps } from "react";
const SvgRefresh = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15 7.061V4.513a.512.512 0 0 1 .81-.41l4.973 3.495a.498.498 0 0 1 0 .819L15.81 11.91a.512.512 0 0 1-.809-.41v-2.42a7.997 7.997 0 1 0 9.005 7.93 1 1 0 0 1 2 0c0 5.523-4.477 10-10 10s-10-4.477-10-10A10 10 0 0 1 15 7.06"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgRefresh;
