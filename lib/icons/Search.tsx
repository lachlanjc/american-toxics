import * as React from "react";
import type { SVGProps } from "react";
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
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
      fill=""
      fillRule="evenodd"
      d="M14.505 5.012a9.487 9.487 0 0 1 7.624 15.15l5.129 4.338a1.96 1.96 0 1 1-2.764 2.764l-4.339-5.128a9.496 9.496 0 0 1-13.283-1.974 9.496 9.496 0 0 1 7.633-15.15m0 17a7.5 7.5 0 1 0-7.5-7.5 7.5 7.5 0 0 0 7.5 7.5"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgSearch;
