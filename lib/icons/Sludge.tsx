import * as React from "react";
import type { SVGProps } from "react";
const SvgSludge = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    role="img"
    {...props}
  >
    <g
      fill=""
      fillRule="evenodd"
      clipPath="url(#Sludge_svg__a)"
      clipRule="evenodd"
    >
      <path d="m20.23 11.753-8.485 8.486a1 1 0 0 0 1.414 1.414l8.486-8.485a1 1 0 0 0-1.415-1.415m-8.485 5.657 5.657-5.657a1 1 0 0 0-1.414-1.414l-5.657 5.657a1 1 0 0 0 1.414 1.414m-1.414-4.242 2.828-2.829a1 1 0 1 0-1.414-1.414l-2.828 2.828a1 1 0 0 0 1.414 1.415" />
      <path d="M28.003 16.007c0 6.627-5.372 12-12 12-6.627 0-12-5.373-12-12 0-6.628 5.373-12 12-12 6.628 0 12 5.373 12 12m-5.288-7.442c-4.111-3.7-10.444-3.366-14.143.746a10.015 10.015 0 0 0 0 13.397.5.5 0 0 0 .72.01L22.723 9.283a.5.5 0 0 0-.009-.72" />
    </g>
    <defs>
      <clipPath id="Sludge_svg__a">
        <path fill="#fff" d="M0 32h32V0H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSludge;
