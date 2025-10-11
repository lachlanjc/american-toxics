import type { PropsWithChildren } from "react";
import MapLayoutClient from "./layout-map.client";

export default function Layout({ children }: PropsWithChildren<object>) {
  return <MapLayoutClient>{children}</MapLayoutClient>;
}
