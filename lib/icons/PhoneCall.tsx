import * as React from "react";
import type { SVGProps } from "react";
const SvgPhoneCall = (props: SVGProps<SVGSVGElement>) => (
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
      d="M25.06 25.861a.94.94 0 0 1-.915.65c-1.804-.036-6.814-.692-12.383-6.261-5.569-5.57-6.224-10.58-6.26-12.383a.94.94 0 0 1 .65-.915l4.274-1.395a.975.975 0 0 1 1.191.542l1.707 3.952a.95.95 0 0 1-.196 1.056l-2.003 2.003a.47.47 0 0 0-.11.499 11.7 11.7 0 0 0 2.884 4.504 11.7 11.7 0 0 0 4.504 2.884c.173.065.369.022.5-.11l2.002-2.002a.95.95 0 0 1 1.057-.196l3.952 1.706c.46.199.694.714.542 1.19z"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgPhoneCall;
