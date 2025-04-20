import * as React from "react";
import type { SVGProps } from "react";
const SvgArrowRight = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.214 24.228a1 1 0 0 1-1.416-1.414l5.81-5.804H6.005a1 1 0 1 1 0-2H23.59l-5.794-5.786a1 1 0 0 1 1.417-1.415l7.51 7.503a1 1 0 0 1 .002 1.413l-.001.001z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgArrowRight;
