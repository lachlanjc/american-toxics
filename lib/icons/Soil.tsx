import type { SVGProps } from "react";

const SvgSoil = (props: SVGProps<SVGSVGElement>) => (
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
      d="M16.01 28.012c-6.627 0-12-5.373-12-12 0-6.628 5.373-12 12-12 6.628 0 12 5.372 12 12 0 6.627-5.372 12-12 12m0-22c-5.522 0-10 4.477-10 10s4.478 10 10 10 10-4.477 10-10-4.477-10-10-10"
      fillRule="evenodd"
    />
    <path
      clipRule="evenodd"
      d="M16 22.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0m7.5-8.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M12 23a3 3 0 1 1 0-6 3 3 0 0 1 0 6m-2.5-7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
      fillRule="evenodd"
    />
    <path d="M19.5 19.5a2 2 0 1 0 4 0 2 2 0 0 0-4 0M15.5 17a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M13 13.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M17.5 13a2 2 0 1 0 4 0 2 2 0 0 0-4 0" />
  </svg>
);
export default SvgSoil;
