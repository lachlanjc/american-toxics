import * as React from "react";
import type { SVGProps } from "react";
const SvgWaste = (props: SVGProps<SVGSVGElement>) => (
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
      fillRule="evenodd"
      d="M24.505 10.01h-17a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h3c0-1.465.308-2.321.992-3.006.685-.684 1.538-.992 3.003-.992h3.01c1.465 0 2.318.307 3.003.992.684.685.992 1.54.992 3.006h3a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1m-5.496-4.503a1.92 1.92 0 0 0-1.502-.496h-3.004A1.92 1.92 0 0 0 13 5.507a1.92 1.92 0 0 0-.496 1.503h7a1.92 1.92 0 0 0-.496-1.503M23.5 11.01a.5.5 0 0 1 .5.531l-.88 14.063a1.503 1.503 0 0 1-1.504 1.406H10.393a1.503 1.503 0 0 1-1.503-1.406l-.882-14.062a.5.5 0 0 1 .5-.532z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgWaste;
