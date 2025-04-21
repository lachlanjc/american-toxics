import * as React from "react";
import type { SVGProps } from "react";
const SvgLibrary = (props: SVGProps<SVGSVGElement>) => (
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
      d="M14.575 25.427a12.5 12.5 0 0 0-5.895-1.423c-1.163.011-2.32.17-3.442.471a.56.56 0 0 1-.733-.535V7.632c0-.235.146-.445.366-.527a13.5 13.5 0 0 1 3.81-.6c2.31-.027 4.58.602 6.548 1.813a.62.62 0 0 1 .276.52v16.054a.62.62 0 0 1-.93.535m12.93-17.795V23.94a.56.56 0 0 1-.733.535 13.8 13.8 0 0 0-3.442-.47 12.5 12.5 0 0 0-5.895 1.422.62.62 0 0 1-.93-.535V8.838a.62.62 0 0 1 .276-.52 12.2 12.2 0 0 1 6.55-1.812c1.29.016 2.574.217 3.808.599.22.082.366.292.366.527"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgLibrary;
