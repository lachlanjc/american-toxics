import * as React from "react";
import type { SVGProps } from "react";
const SvgNv = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={50}
    height={80}
    viewBox="0 0 50 80"
    {...props}
  >
    <path d="M45.84 55.84 45.04 4l-19.92.16-19.76-.88L4 30.16l37.92 36.32.32-1.84-.56-2.8-.72-5.12 1.28-.48h1.44l1.28 1.04.48-.16z" />
  </svg>
);
export default SvgNv;
