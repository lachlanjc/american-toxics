import type { SVGProps } from "react";

const SvgChemical = (props: SVGProps<SVGSVGElement>) => (
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
      d="m20.02 13.89 5.726 10.126A2 2 0 0 1 24.004 27H7.996a2 2 0 0 1-1.742-2.984L11.98 13.89c.34-.6.518-1.279.518-1.968V6H12a1 1 0 1 1 0-2h8a1 1 0 0 1 0 2h-.498v5.922c0 .69.178 1.367.518 1.968M17.5 6h-3v5.922a6 6 0 0 1-.777 2.952l-.99 1.753a.25.25 0 0 0 .217.373h6.1a.25.25 0 0 0 .218-.373l-.991-1.753a6 6 0 0 1-.777-2.952z"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgChemical;
