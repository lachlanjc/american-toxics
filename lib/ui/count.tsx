export function Count({
  value,
  word = "site",
}: {
  value: number;
  word?: string;
}) {
  return (
    <span className="inline-flex items-center align-middle ml-1.5 rounded-full border border-black/20 px-2 py-0.5 text-xs font-normal bg-black/5 tracking-normal font-mono text-neutral-800 transition-colors">
      {value.toLocaleString("en-US", { maximumFractionDigits: 0 })} {word}
      {word.length > 0 ? (value === 1 ? "" : "s") : ""}
    </span>
  );
}
