import type { SVGProps } from "react";

const SvgCopy = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill="currentColor"
    height={32}
    role="img"
    viewBox="0 0 32 32"
    width={32}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      clipRule="evenodd"
      d="M20.51 28.012h-13a1.5 1.5 0 0 1-1.5-1.5v-17a1.5 1.5 0 0 1 1.5-1.5h3.5v14.5a2.5 2.5 0 0 0 2.5 2.5h8.5v1.5a1.5 1.5 0 0 1-1.5 1.5m1-17a.5.5 0 0 1-.5-.5V5.219a.5.5 0 0 1 .854-.354l5.293 5.293a.5.5 0 0 1-.354.854zm6.5 2.5v9a1.5 1.5 0 0 1-1.5 1.5h-13a1.5 1.5 0 0 1-1.5-1.5v-17a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5v5a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 1 1.5 1.5"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgCopy;
