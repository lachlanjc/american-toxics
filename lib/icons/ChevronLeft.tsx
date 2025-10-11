import type { SVGProps } from "react";

const SvgChevronLeft = (props: SVGProps<SVGSVGElement>) => (
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
      d="M19.213 24.211c-.391.391-1.025.391-1.416 0l-7.512-7.502a1 1 0 0 1-.001-1.413l.001-.002 7.512-7.502a1 1 0 1 1 1.416 1.415l-6.803 6.795 6.803 6.795a1 1 0 0 1 .001 1.413z"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgChevronLeft;
