import type { SVGProps } from "react";

const SvgClose = (props: SVGProps<SVGSVGElement>) => (
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
      d="M23.707 23.718a1 1 0 0 1-1.415 0l-6.3-6.3-6.294 6.294a1 1 0 0 1-1.416-1.415l6.295-6.294-6.294-6.294a1 1 0 0 1 1.415-1.415l6.294 6.293 6.299-6.298a1 1 0 1 1 1.415 1.415l-6.299 6.299 6.3 6.3a1 1 0 0 1 0 1.415"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgClose;
