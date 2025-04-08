import { ComponentPropsWithoutRef } from "react";

export function Title(props: ComponentPropsWithoutRef<"h1">) {
  return (
    // <Drawer.Title asChild>
    <h1
      {...props}
      className="text-balance font-bold font-sans tracking-tight text-3xl leading-8 -ml-[2px] -mt-1.5"
    />
    // </Drawer.Title>
  );
}

export function Heading(props: ComponentPropsWithoutRef<"h1">) {
  return (
    <h2
      {...props}
      className="text-xl font-bold font-sans tracking-tight mb-2"
    />
  );
}
