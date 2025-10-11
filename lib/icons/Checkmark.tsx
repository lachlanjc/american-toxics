import type { SVGProps } from "react";

const SvgCheckmark = (props: SVGProps<SVGSVGElement>) => (
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
      d="m8.834 15.428 4.894 7.01L24.204 7.434a1 1 0 0 1 1.525-.139c.347.366.384.929.085 1.336L14.745 24.485a1.24 1.24 0 0 1-2.034 0l-5.488-7.86a1.044 1.044 0 0 1 .085-1.336 1 1 0 0 1 1.525.139"
      fillRule="evenodd"
    />
  </svg>
);
export default SvgCheckmark;
