import * as React from "react";
import type { SVGProps } from "react";
const SvgShare = (props: SVGProps<SVGSVGElement>) => (
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
      d="M25.005 15.009v10.003a3.004 3.004 0 0 1-3 3.001h-12a3.004 3.004 0 0 1-3-3.001V15.009a3.004 3.004 0 0 1 3-3.001h2a1 1 0 0 1 0 2h-2c-.552.001-1 .449-1 1v10.004c0 .552.448 1 1 1h12c.552 0 1-.448 1-1V15.009c0-.552-.448-1-1-1h-2a1 1 0 0 1 0-2.001h2a3.004 3.004 0 0 1 3 3m-9 5.003a1 1 0 0 1-1-1V9.017h-2.497a.514.514 0 0 1-.41-.811l3.494-4.987a.498.498 0 0 1 .82 0l3.494 4.987a.514.514 0 0 1-.41.811h-2.491v9.995a1 1 0 0 1-1 1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgShare;
