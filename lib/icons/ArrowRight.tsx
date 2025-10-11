import type { SVGProps } from "react";

const SvgArrowRight = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.214 24.228a1 1 0 0 1-1.416-1.414l5.81-5.804H6.005a1 1 0 1 1 0-2H23.59l-5.794-5.786a1 1 0 0 1 1.417-1.415l7.51 7.503a1 1 0 0 1 .002 1.413l-.001.001z"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgArrowRight;
