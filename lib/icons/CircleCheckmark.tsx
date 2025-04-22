import * as React from "react";
import type { SVGProps } from "react";
const SvgCircleCheckmark = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.005 28.01c-6.628 0-12-5.372-12-12 0-6.627 5.372-12 12-12 6.627 0 12 5.373 12 12 0 6.628-5.373 12-12 12m6.7-17.709a1 1 0 0 0-1.525.139l-6.421 9.195-2.938-4.206a1 1 0 0 0-1.524-.138 1.04 1.04 0 0 0-.086 1.335l3.312 4.742a1.507 1.507 0 0 0 2.47 0l6.798-9.732c.298-.407.262-.97-.086-1.335"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgCircleCheckmark;
