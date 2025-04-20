import * as React from "react";
import type { SVGProps } from "react";
const SvgPopOut = (props: SVGProps<SVGSVGElement>) => (
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
      d="M26 13.488a1 1 0 0 1-1.002-1v-4.07l-8.312 8.289a.995.995 0 0 1-1.402-1.411l8.321-8.298h-4.116a.999.999 0 0 1 0-1.998h6.51A1 1 0 0 1 27 5.999v6.49a1 1 0 0 1-1 .999m-12-2.491H8c-.552 0-1 .448-1 1V24c0 .552.448 1 1 1h12c.552 0 1-.448 1-1v-6a1 1 0 1 1 2 0v6A3.004 3.004 0 0 1 20 27H8A3.004 3.004 0 0 1 5 24V11.997a3.004 3.004 0 0 1 3-3.001h6a1 1 0 0 1 0 2"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgPopOut;
