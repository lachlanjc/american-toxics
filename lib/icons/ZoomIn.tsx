import type { SVGProps } from "react";

const SvgZoomIn = (props: SVGProps<SVGSVGElement>) => (
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
      d="m24.494 27.263-4.339-5.128a9.526 9.526 0 1 1 1.974-1.974l5.129 4.338a1.96 1.96 0 1 1-2.764 2.764M14.505 7.01a7.5 7.5 0 1 0 7.5 7.5 7.5 7.5 0 0 0-7.5-7.5m1 8.5v3a1 1 0 0 1-2 0v-3h-3a1 1 0 0 1 0-2h3v-3a1 1 0 1 1 2 0v3h3a1 1 0 1 1 0 2z"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgZoomIn;
