import React from "react";
import clsx from "clsx";

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
      ref={ref}
      className={clsx(
        "border border-black/10 rounded-lg bg-black/2 px-4 py-3",
        className,
      )}
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
      ref={ref}
      className={clsx(
        "text-xl font-bold font-sans leading-none tracking-tight",
        className,
      )}
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
      ref={ref}
      className={clsx("-mx-4 my-4 border-black/10", props.className)}
    />
  );
});
