import clsx from "clsx";

export function Count({
  value,
  word = "site",
  className,
}: {
  value: number;
  word?: string;
  className?: string;
}) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-black/20 bg-black/5 px-2 py-0.5 align-middle font-mono font-normal text-neutral-800 text-xs tracking-normal transition-colors",
        className || "ml-1"
      )}
    >
      {value.toLocaleString("en-US", { maximumFractionDigits: 0 })} {word}
      {word.length > 0 ? (value === 1 ? "" : "s") : ""}
    </span>
  );
}
