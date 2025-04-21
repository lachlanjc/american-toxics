import * as React from "react";
import type { SVGProps } from "react";
const SvgChevronUp = (props: SVGProps<SVGSVGElement>) => (
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
      d="m22.809 19.227-6.795-6.798-6.795 6.798a1 1 0 0 1-1.415-1.415l7.502-7.506a1 1 0 0 1 1.415 0l7.502 7.506a1 1 0 0 1-1.414 1.415"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgChevronUp;
