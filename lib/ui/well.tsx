import clsx from "clsx";
import React from "react";

/**
 * A styled section container for well components.
 */
export const WellRoot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"section">
>(function WellRoot({ children, className, ...props }, ref) {
  return (
    <section
      {...props}
      className={clsx(
        "rounded-lg border border-black/10 bg-black/2 px-4 py-3",
        className
      )}
      ref={ref}
    >
      {children}
    </section>
  );
});

/**
 * A styled title for well sections.
 */
export const WellTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<"h2">
>(function WellTitle({ children, className = "mb-2", ...props }, ref) {
  return (
    <h2
      {...props}
      className={clsx(
        "font-bold font-sans text-xl leading-none tracking-tight",
        className
      )}
      ref={ref}
    >
      {children}
    </h2>
  );
});

/**
 * A divider element for separating well sections.
 */
export const WellDivider = React.forwardRef<
  HTMLHRElement,
  React.ComponentPropsWithoutRef<"hr">
>(function WellDivider(props, ref) {
  return (
    <hr
      {...props}
      className={clsx("-mx-4 my-4 border-black/10", props.className)}
      ref={ref}
    />
  );
});
