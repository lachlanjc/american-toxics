import * as React from "react";
import type { SVGProps } from "react";
const SvgOther = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16 28C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12m0-22C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6m1.125 12a.5.5 0 0 1-.5.5H15.5a.5.5 0 0 1-.5-.5c0-3.322 2.813-3.01 2.813-5.5 0-.828-.94-1.5-1.907-1.5-.966 0-1.922.672-1.922 1.5-.003.285.041.568.13.838a.498.498 0 0 1-.47.662H12.63a.5.5 0 0 1-.485-.366A4.2 4.2 0 0 1 12 12.5c0-1.933 1.79-3.5 4-3.5s4 1.567 4 3.5c0 3.209-2.875 3.084-2.875 5.5M16 20a1.5 1.5 0 1 1-1.5 1.5A1.5 1.5 0 0 1 16 20"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgOther;
