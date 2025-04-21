import * as React from "react";
import type { SVGProps } from "react";
const SvgSurfaceWater = (props: SVGProps<SVGSVGElement>) => (
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
      id="SurfaceWater_svg__a"
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
    <g mask="url(#SurfaceWater_svg__a)">
      <path d="M16 4c6.627 0 12 5.373 12 12 0 3.536-1.532 6.713-3.966 8.909a.26.26 0 0 0-.083.213q.037.42.038.867c0 2.762-.477 5-6 5s-10-2.238-10-5c0-.275.034-.536.094-.786a.26.26 0 0 0-.078-.26A11.97 11.97 0 0 1 4 16C4 9.373 9.373 4 16 4m0 2C10.477 6 6 10.477 6 16a9.97 9.97 0 0 0 2.951 7.089.25.25 0 0 0 .363-.016c1.165-1.3 2.675-2.317 2.675-3.584 0-1.49-2-2.233-2-5 0-3.773 5.773-5.99 8.18-7.875a.225.225 0 0 0-.098-.4A10 10 0 0 0 16 6m4.06.861a.256.256 0 0 0-.342.162c-.719 2.198-2.729 3.304-2.729 4.966 0 4.152 4.47 6.15 6.265 10.348.074.172.302.215.422.071a10 10 0 0 0-3.615-15.547" />
    </g>
  </svg>
);
export default SvgSurfaceWater;
