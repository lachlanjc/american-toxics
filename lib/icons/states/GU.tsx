import * as React from "react";
import type { SVGProps } from "react";
const SvgGu = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={30}
    viewBox="0 0 24 30"
    {...props}
  >
    <path
      fill="inherit"
      fillRule="nonzero"
      d="M17.4 0h-.9l-1.4 2.2.1 2.1-.6 1.2-1.8 3.1.1 1.2-.5.9-1.2-.3-.7.6.3 1.2-1.6.3-1.7-.1-2.7 1.1-2.1.2 1.7.3-1.4.4 1.1.1v.6h-.8v.5l.5.2-.4 1.2-.5-.8.2-.8-.7-.4-1 .35L0 14.9l.3.9.9.3.3.9 1 .5.3.8-.7 1.4-.3 1.9-.7 1.1.8.5.7 2.6.3 2 .6.5.4.6h.7l1.3.6 1-.2.4.1 1.9-1.9.8-.7.7-1.2v-2.4l-.5-.4h.5l-.1-2 .4-1.6-.2-.4.6-.4.4-1.1-.2-.6 1.6-.4.6-.9.8-.1.9-1.1 2.4-2 1.2-.7.2-.9 2.1-1 1-2.1.1-1 .7-.9.5-1.7-2.4-.1-1.2-.3-.5-1.3z"
    />
  </svg>
);
export default SvgGu;
