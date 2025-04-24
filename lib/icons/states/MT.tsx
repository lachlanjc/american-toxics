import * as React from "react";
import type { SVGProps } from "react";
const SvgMt = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={80}
    height={80}
    viewBox="0 0 80 80"
    {...props}
  >
    <path d="M86.72 41.84 84.4 11.2l-39.6 1.2-40-1.84-.8 10 2 3.2-.08 1.44.4.8-.72.32 2.64 2.08 3.6 5.92.64-.48.64.96h1.76l-1.76 5.12.64 2.56-1.12 1.28-.16 1.92 1.6 1.04 2.4-2 1.36.96.32 2.96L20 51.76v1.6l1.92 1.12 1.12 3.12 1.12.96.48-1.28 2.72.4 1.28-.96 5.52.32-.32-.96.96-1.12 2.24 2.72.08-5.12h25.44l24.8-1.12z" />
  </svg>
);
export default SvgMt;
