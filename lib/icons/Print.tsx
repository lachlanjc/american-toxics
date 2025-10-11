import type { SVGProps } from "react";

const SvgPrint = (props: SVGProps<SVGSVGElement>) => (
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
      d="M27.51 26.01h-23a.5.5 0 0 1-.5-.5v-8a2.5 2.5 0 0 1 2.5-2.5h19a2.5 2.5 0 0 1 2.5 2.5v8a.5.5 0 0 1-.5.5m-2.08-2.777-2-3a.5.5 0 0 0-.416-.223H9.006a.5.5 0 0 0-.416.223l-2 3a.5.5 0 0 0 .415.777h18.01a.5.5 0 0 0 .416-.777m-2.42-9.223h-14a.5.5 0 0 1-.5-.5v-8a1.5 1.5 0 0 1 1.5-1.5h12a1.5 1.5 0 0 1 1.5 1.5v8a.5.5 0 0 1-.5.5"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgPrint;
