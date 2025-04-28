import React from "react";

export type IconComponent = (
  props: React.SVGProps<SVGSVGElement> & { title?: string },
) => React.JSX.Element;
