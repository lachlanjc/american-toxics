import * as React from "react";
import type { SVGProps } from "react";
const SvgIdCard = (props: SVGProps<SVGSVGElement>) => (
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
      d="M26 25H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2M12.5 10c-1.787 0-2.998 1.45-2.998 3.375C9.502 15.611 10.9 17 12.5 17s2.999-1.389 2.999-3.625c0-1.925-1.21-3.375-2.999-3.375m0 8c-3.551 0-5.33 1.876-5.498 3.585a.38.38 0 0 0 .375.415h10.247a.38.38 0 0 0 .375-.415C17.831 19.876 16.052 18 12.5 18m13-4h-7a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1m0 3h-6a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgIdCard;
