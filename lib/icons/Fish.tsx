import * as React from "react";
import type { SVGProps } from "react";
const SvgFish = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16 28C9.373 28 4 22.627 4 16S9.373 4 16 4s12 5.373 12 12-5.373 12-12 12m0-22C10.477 6 6 10.477 6 16s4.477 10 10 10 10-4.477 10-10S21.523 6 16 6"
      clipRule="evenodd"
    />
    <path
      fillRule="evenodd"
      d="M23.503 16.5c0-1.577-3.035-3.795-6.528-4.486-.4-.079-.579.166-.409.539q.11.217.188.447c-2.291 0-4.179 1.449-4.924 2.118a.52.52 0 0 1-.674.001A4.1 4.1 0 0 0 8.786 14a.248.248 0 0 0-.287.28c.14 1.135 1.006 2.221 1.006 2.221S8.64 17.587 8.5 18.723a.248.248 0 0 0 .287.28 4.1 4.1 0 0 0 2.37-1.128.516.516 0 0 1 .674.001c.745.671 2.627 2.124 5.923 2.124s5.75-2.44 5.75-3.5m-3.75-1.5a.75.75 0 1 0 .75.75.75.75 0 0 0-.75-.75"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgFish;
