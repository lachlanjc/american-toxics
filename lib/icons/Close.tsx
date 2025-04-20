import * as React from "react";
import type { SVGProps } from "react";
const SvgClose = (props: SVGProps<SVGSVGElement>) => (
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
      d="M23.707 23.718a1 1 0 0 1-1.415 0l-6.3-6.3-6.294 6.294a1 1 0 0 1-1.416-1.415l6.295-6.294-6.294-6.294a1 1 0 0 1 1.415-1.415l6.294 6.293 6.299-6.298a1 1 0 1 1 1.415 1.415l-6.299 6.299 6.3 6.3a1 1 0 0 1 0 1.415"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgClose;
