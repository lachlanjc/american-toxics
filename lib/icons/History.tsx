import * as React from "react";
import type { SVGProps } from "react";
const SvgHistory = (props: SVGProps<SVGSVGElement>) => (
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
      d="m19.967 19.444-4.78-2.23a1.19 1.19 0 0 1-.691-1.202c.01-.087.747-7.24.756-7.328a.755.755 0 0 1 1.5 0l.677 6.566 3.32 2.99a.726.726 0 0 1-.782 1.204m-17.464-3.45H5C5.003 9.923 9.927 5 16 5c6.075 0 11 4.925 11 11s-4.925 11-11 11a10.96 10.96 0 0 1-6.976-2.494 1 1 0 0 1 1.294-1.526A9 9 0 1 0 16 7a9 9 0 0 0-9 8.995h2.491a.514.514 0 0 1 .41.81l-3.494 4.988a.498.498 0 0 1-.82 0l-3.494-4.987a.514.514 0 0 1 .41-.812"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgHistory;
