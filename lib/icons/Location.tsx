import type { SVGProps } from "react";

const SvgLocation = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.798 27.387a1.064 1.064 0 0 1-2.014-.253l-1.392-7.654a1.06 1.06 0 0 0-.857-.857l-7.653-1.391a1.064 1.064 0 0 1-.253-2.015L24.49 6.114a1.064 1.064 0 0 1 1.41 1.41z"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgLocation;
