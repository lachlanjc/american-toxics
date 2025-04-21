import * as React from "react";
import type { SVGProps } from "react";
const SvgWarning = (props: SVGProps<SVGSVGElement>) => (
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
      d="M27.503 26.004H4.512a1.5 1.5 0 0 1-1.283-2.277L14.725 4.72a1.5 1.5 0 0 1 2.565 0l11.496 19.006a1.5 1.5 0 0 1-1.283 2.277M16.007 24.01a1.5 1.5 0 1 0-1.5-1.5 1.5 1.5 0 0 0 1.5 1.5m1-14h-1.99a.505.505 0 0 0-.51.527l.457 8.5a.506.506 0 0 0 .51.473h1.075a.507.507 0 0 0 .51-.473l.458-8.5a.505.505 0 0 0-.51-.527"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgWarning;
