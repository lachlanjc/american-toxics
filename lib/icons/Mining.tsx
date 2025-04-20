import * as React from "react";
import type { SVGProps } from "react";
const SvgMining = (props: SVGProps<SVGSVGElement>) => (
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
      d="M29.872 21.179a.418.418 0 0 1-.7.19l-5.93-6a.844.844 0 0 1-.001-1.185l3.05-3.082a.414.414 0 0 1 .703.32c0 3.454 3.735 6.414 2.878 9.757M17.81 8.752a.844.844 0 0 1-1.185 0l-6-5.931a.418.418 0 0 1 .19-.7C14.158 1.264 17.118 5 20.57 5a.414.414 0 0 1 .322.703z"
      clipRule="evenodd"
    />
    <path
      fill=""
      d="M7.85 27.848a.5.5 0 0 1-.706 0l-2.998-3a.5.5 0 0 1 0-.708L22.652 5.636a.5.5 0 0 1 .706 0l2.999 3a.5.5 0 0 1 0 .708z"
    />
  </svg>
);
export default SvgMining;
