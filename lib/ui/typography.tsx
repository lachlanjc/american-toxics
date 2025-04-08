import { ComponentPropsWithoutRef } from "react";

export function Title(props: ComponentPropsWithoutRef<"h1">) {
  return (
    // <Drawer.Title asChild>
    <h1
      {...props}
      className="text-balance font-bold font-sans tracking-tight text-3xl -ml-[2px]"
    />
    // </Drawer.Title>
  );
}
