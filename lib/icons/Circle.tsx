import type { SVGProps } from "react";

const SvgCircle = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.005 28.01c-6.628 0-12-5.372-12-12 0-6.627 5.372-12 12-12 6.627 0 12 5.373 12 12 0 6.628-5.373 12-12 12"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgCircle;
