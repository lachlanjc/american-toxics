import * as React from "react";
import type { SVGProps } from "react";
const SvgChevronLeft = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.213 24.211c-.391.391-1.025.391-1.416 0l-7.512-7.502a1 1 0 0 1-.001-1.413l.001-.002 7.512-7.502a1 1 0 1 1 1.416 1.415l-6.803 6.795 6.803 6.795a1 1 0 0 1 .001 1.413z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgChevronLeft;
