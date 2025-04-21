import * as React from "react";
import type { SVGProps } from "react";
const SvgMap = (props: SVGProps<SVGSVGElement>) => (
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
      d="M27.505 6.757v15.985a1 1 0 0 1-.606.919l-5.348 2.292a.75.75 0 0 1-1.046-.69V9.28a1 1 0 0 1 .606-.92l5.349-2.291a.75.75 0 0 1 1.045.69M10.899 23.661l-5.348 2.292a.75.75 0 0 1-1.046-.69V9.28a1 1 0 0 1 .606-.919l5.349-2.292a.75.75 0 0 1 1.045.69v15.984a1 1 0 0 1-.606.919m2.652-17.593 5.348 2.292a1 1 0 0 1 .606.92v15.984a.75.75 0 0 1-1.045.689l-5.349-2.292a1 1 0 0 1-.606-.92V6.758a.75.75 0 0 1 1.046-.69"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgMap;
