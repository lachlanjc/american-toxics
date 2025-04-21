import * as React from "react";
import type { SVGProps } from "react";
const SvgFuel = (props: SVGProps<SVGSVGElement>) => (
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
      d="M29.75 12c-.69 0-1.25.56-1.25 1.25v7.151a3.565 3.565 0 0 1-3.33 3.595A3.5 3.5 0 0 1 21.5 20.5v-4A1.5 1.5 0 0 0 20 15a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5 3.5 3.5 0 0 1 3.5 3.5v4a1.5 1.5 0 0 0 3 0v-7c0-2.343-1.996-4.27-3.676-4.905a.5.5 0 0 1-.324-.466v-.622a.503.503 0 0 1 .539-.502 9.3 9.3 0 0 1 6.903 4.384q.059.111.058.238v.123a.25.25 0 0 1-.25.25M20.5 26v1a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1h1V7a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v18h1a1 1 0 0 1 1 1m-4-18a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgFuel;
