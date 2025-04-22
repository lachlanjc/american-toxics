import * as React from "react";
import type { SVGProps } from "react";
const SvgSticker = (props: SVGProps<SVGSVGElement>) => (
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
      d="M26.586 11.657c-7.075-1.162-13.752 3.631-14.914 10.706-.23 1.396-.229 2.82.002 4.216a.353.353 0 0 1-.497.374C5.112 24.3 2.347 17.232 5 11.167s9.722-8.83 15.786-6.175a11.99 11.99 0 0 1 6.172 6.168.353.353 0 0 1-.373.497m-2.1.826c.676.001 1.35.06 2.014.179a.59.59 0 0 1 .306.999L13.676 26.8a.59.59 0 0 1-.998-.306 11.6 11.6 0 0 1-.179-2.015c-.002-6.623 5.365-11.993 11.987-11.996"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgSticker;
