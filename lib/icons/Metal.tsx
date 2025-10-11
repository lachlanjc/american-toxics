import type { SVGProps } from "react";

const SvgMetal = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.001 27.992c-5.523 0-10-4.477-10-10v-7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v7.5a3 3 0 1 0 6 0v-7.5a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v7.5c0 5.523-4.477 10-10 10m9.5-19h-6a.5.5 0 0 1-.5-.5v-2.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2.5a.5.5 0 0 1-.5.5m-13 0h-6a.5.5 0 0 1-.5-.5v-2.5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2.5a.5.5 0 0 1-.5.5"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgMetal;
