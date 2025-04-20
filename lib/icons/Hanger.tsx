import * as React from "react";
import type { SVGProps } from "react";
const SvgHanger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    role="img"
    viewBox="0 0 32 32"
    {...props}
  >
    <path
      fill=""
      fillRule="evenodd"
      d="M3.996 24a1 1 0 0 1-.604-1.797l13.51-10.25c.372-.284.592-.726.593-1.194v-1.26a1.5 1.5 0 1 0-3 0 1 1 0 1 1-2 0 3.5 3.5 0 1 1 7 0v1.26a3.52 3.52 0 0 1-1.384 2.788l-.456.346 10.953 8.31A1 1 0 0 1 28.005 24zm21.036-2L16 15.148 6.97 22z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgHanger;
