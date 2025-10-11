import type { SVGProps } from "react";

const SvgChart = (props: SVGProps<SVGSVGElement>) => (
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
      d="M27.01 26.01h-22a1 1 0 1 1 0-2h22a1 1 0 1 1 0 2m-1-3h-4a1 1 0 0 1-1-1v-11a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1m-8-17a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-15a1 1 0 0 1 1-1zm-8 8a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgChart;
