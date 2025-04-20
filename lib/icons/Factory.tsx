import * as React from "react";
import type { SVGProps } from "react";
const SvgFactory = (props: SVGProps<SVGSVGElement>) => (
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
      fill=""
      fillRule="evenodd"
      d="M27 26H5a1 1 0 0 1-1-1V13.997a1 1 0 0 1 1-1h.5l.955-9.547A.5.5 0 0 1 6.952 3h1.595a.5.5 0 0 1 .498.45l.915 9.148 5.263-3.508a.5.5 0 0 1 .777.416v3.065l5.223-3.48a.5.5 0 0 1 .777.415v3.065l5.223-3.48a.5.5 0 0 1 .777.415V25a1 1 0 0 1-1 1m-13-9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm0 5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm6-5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm0 5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm6-5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5zm0 5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgFactory;
