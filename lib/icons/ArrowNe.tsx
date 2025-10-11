import type { SVGProps } from "react";

const SvgArrowNe = (props: SVGProps<SVGSVGElement>) => (
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
      d="M23 20.5a1 1 0 0 1-1-1v-8.078l-12.3 12.3a.995.995 0 1 1-1.4-1.412L20.608 10H12.5a1 1 0 1 1 0-2H23a1 1 0 0 1 1 1v10.5a1 1 0 0 1-1 1"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgArrowNe;
