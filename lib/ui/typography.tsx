import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

export function Title(props: ComponentPropsWithoutRef<"h1">) {
  return (
    // <Drawer.Title asChild>
    <h1
      {...props}
      className="text-balance font-bold font-sans tracking-tight text-3xl/8 md:-ml-[2px] -mt-[2px] md:-mt-1.5"
    />
    // </Drawer.Title>
  );
}

export function Heading(props: ComponentPropsWithoutRef<"h1">) {
  return (
    <h2
      {...props}
      className={clsx(
        "text-xl font-bold font-sans tracking-tight",
        props.className || "mb-2",
      )}
    />
  );
}
