import * as React from "react";
import type { SVGProps } from "react";
const SvgNapl = (props: SVGProps<SVGSVGElement>) => (
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
      d="M28.004 15.992c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 6.628 5.373 12 12 12s12-5.372 12-12m-21.427.352a.308.308 0 0 1-.57-.153l-.003-.199c0-5.523 4.477-10 10-10s10 4.477 10 10q0 .1-.003.2a.308.308 0 0 1-.57.152c-3.108-5.207-9.848-6.908-15.054-3.8a11 11 0 0 0-3.8 3.8"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgNapl;
