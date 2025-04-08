export function WellRoot({
  children,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      {...props}
      className={`border border-black/10 rounded-lg bg-black/2 px-4 py-3 ${className}`}
    >
      {children}
    </section>
  );
}

export function WellTitle({
  className,
  children,
}: React.ComponentPropsWithoutRef<"h2">) {
  return (
    <h2 className={`text-xl font-bold font-sans tracking-tight ${className}`}>
      {children}
    </h2>
  );
}

export function WellDivider({ className }: { className?: string }) {
  return <hr className={`-mx-4 my-4 border-black/10 ${className}`} />;
}
