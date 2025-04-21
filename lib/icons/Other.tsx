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
      d="M16.01 28.012c-6.627 0-12-5.373-12-12 0-6.628 5.373-12 12-12 6.628 0 12 5.372 12 12 0 6.627-5.372 12-12 12m0-22c-5.523 0-10 4.477-10 10s4.478 10 10 10 10-4.477 10-10-4.477-10-10-10m1.125 12a.5.5 0 0 1-.5.5H15.51a.5.5 0 0 1-.5-.5c0-3.322 2.813-3.01 2.813-5.5 0-.829-.94-1.5-1.906-1.5s-1.922.671-1.922 1.5c-.004.284.04.567.13.838a.498.498 0 0 1-.47.662h-1.016a.5.5 0 0 1-.485-.367q-.15-.557-.144-1.133c0-1.933 1.791-3.5 4-3.5s4 1.567 4 3.5c0 3.208-2.875 3.083-2.875 5.5m-1.125 2a1.5 1.5 0 1 1-1.5 1.5 1.5 1.5 0 0 1 1.5-1.5"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgOther;
