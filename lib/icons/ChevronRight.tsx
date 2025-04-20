import * as React from "react";
import type { SVGProps } from "react";
const SvgChevronRight = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14.214 24.228a1 1 0 0 1-1.416-1.414l6.803-6.795-6.803-6.795a1 1 0 0 1 1.416-1.415l7.511 7.503a1 1 0 0 1 .002 1.413l-.002.001z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgChevronRight;
