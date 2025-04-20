import * as React from "react";
import type { SVGProps } from "react";
const SvgWater = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={32}
    height={32}
    fill="currentColor"
    role="img"
    {...props}
  >
    <path
      fill=""
      fillRule="evenodd"
      d="M16.005 28.009a9 9 0 0 1-9-9c0-5.866 6.493-13.675 8.449-15.764a.756.756 0 0 1 1.102 0c1.957 2.089 8.449 9.898 8.449 15.765a9 9 0 0 1-9 8.999m-1.51-20.15a32.3 32.3 0 0 0-2.49 10.652.513.513 0 0 1-.5.5h-1.5a.48.48 0 0 1-.5-.5c.203-3.291 2.506-8.131 4.524-10.88.184-.25.59-.052.466.228"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgWater;
