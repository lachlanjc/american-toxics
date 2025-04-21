import * as React from "react";
import type { SVGProps } from "react";
const SvgMail = (props: SVGProps<SVGSVGElement>) => (
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
      d="M26.51 7.003h-21a1.5 1.5 0 0 0-1.5 1.5v1.133c0 .473.223.917.6 1.2l10.502 7.871c.533.4 1.266.4 1.799 0l10.499-7.87a1.5 1.5 0 0 0 .6-1.2V8.503a1.5 1.5 0 0 0-1.5-1.5m.909 5.077-9.908 7.427a2.5 2.5 0 0 1-3 0L4.603 12.08a.37.37 0 0 0-.592.297v11.127a1.5 1.5 0 0 0 1.5 1.5h21a1.5 1.5 0 0 0 1.5-1.5V12.376a.37.37 0 0 0-.591-.296"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgMail;
