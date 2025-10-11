import type { SVGProps } from "react";

const SvgChevronDown = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.704 21.715a1 1 0 0 1-1.415 0l-7.502-7.506a1 1 0 1 1 1.415-1.415l6.795 6.798 6.795-6.798a1 1 0 1 1 1.414 1.415z"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgChevronDown;
