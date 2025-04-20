import * as React from "react";
import type { SVGProps } from "react";
const SvgInfo = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.01 28.012c-6.627 0-12-5.373-12-12 0-6.628 5.373-12 12-12 6.628 0 12 5.372 12 12 0 6.627-5.372 12-12 12m0-22c-5.522 0-10 4.477-10 10s4.478 10 10 10 10-4.477 10-10-4.477-10-10-10m.75 6a1.64 1.64 0 0 1-1.75-1.5 1.64 1.64 0 0 1 1.75-1.5 1.64 1.64 0 0 1 1.75 1.5 1.64 1.64 0 0 1-1.75 1.5m.71 3.381-1.392 5.255c-.135.51.131 1.041.621 1.238a.5.5 0 0 1 .314.464v.162a.5.5 0 0 1-.5.5H15.02a1.502 1.502 0 0 1-1.46-1.882l1.392-5.255a1.045 1.045 0 0 0-.621-1.238.5.5 0 0 1-.314-.464v-.161a.5.5 0 0 1 .5-.5h1.494a1.502 1.502 0 0 1 1.46 1.881"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgInfo;
