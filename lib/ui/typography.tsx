import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

export function Title(props: ComponentPropsWithoutRef<"h1">) {
  return (
    // <Drawer.Title asChild>
    <h1
      {...props}
      className="md:-ml-[2px] -mt-[2px] md:-mt-1.5 text-balance font-bold font-sans text-3xl/8 tracking-tight"
    />
    // </Drawer.Title>
  );
}

export function Heading(props: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...props}
      className={clsx(
        "font-bold font-sans text-xl tracking-tight",
        props.className || "mb-2"
      )}
    />
  );
}

export function HeadingL(props: ComponentPropsWithoutRef<"h2">) {
  return (
    <h2
      {...props}
      className={clsx(
        "font-bold font-sans text-2xl tracking-tight",
        props.className || "mb-3"
      )}
    />
  );
}
