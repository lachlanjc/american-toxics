import * as React from "react";
import type { SVGProps } from "react";
const SvgCo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={80}
    height={80}
    viewBox="0 0 80 80"
    {...props}
  >
    <path d="m85.28 19.04-.4-14.72-39.68.64-38.88-.8L4 63.28l42.72.88 40.64-.88z" />
  </svg>
);
export default SvgCo;
