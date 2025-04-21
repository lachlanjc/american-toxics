import * as React from "react";
import type { SVGProps } from "react";
const SvgLeachate = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    role="img"
    viewBox="0 0 32 32"
    {...props}
  >
    <mask
      id="Leachate_svg__a"
      width={24}
      height={24}
      x={4}
      y={4}
      maskUnits="userSpaceOnUse"
      style={{
        maskType: "alpha",
      }}
    >
      <circle cx={16} cy={16} r={12} fill="#D9D9D9" />
    </mask>
    <g fillRule="evenodd" clipRule="evenodd" mask="url(#Leachate_svg__a)">
      <path d="M28.003 16c0 6.627-5.372 12-12 12-6.627 0-12-5.373-12-12s5.373-12 12-12c6.628 0 12 5.373 12 12m-5.288-7.442c-4.111-3.7-10.444-3.366-14.143.746a10.015 10.015 0 0 0 0 13.397.5.5 0 0 0 .72.01L22.723 9.276a.5.5 0 0 0-.009-.72" />
      <path d="M8.737 16.957a1 1 0 1 1 1.898-.633l.353 1.06a1 1 0 0 1-1.898.634zm-1.061-3.183-1.06-3.183a1 1 0 0 1 1.897-.633l1.061 3.183a1 1 0 0 1-1.898.633m3.89-2.477a1 1 0 0 1 1.898-.632l1.061 3.183a1 1 0 1 1-1.898.632zm-1.06-3.183-.354-1.06a1 1 0 0 1 1.898-.633l.354 1.06a1 1 0 0 1-1.898.633m5.305 1.769a1 1 0 0 1 1.898-.633l.354 1.06a1 1 0 0 1-1.898.633zm-1.06-3.184-1.062-3.183a1 1 0 0 1 1.898-.632l1.06 3.183a1 1 0 1 1-1.897.632" />
    </g>
  </svg>
);
export default SvgLeachate;
