export function Count({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center align-middle ml-1.5 rounded-full border border-black/20 px-2 py-0.5 text-xs font-semibold tracking-normal font-mono text-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
      {value.toLocaleString("en-US", { maximumFractionDigits: 0 })} site
      {value === 1 ? "" : "s"}
    </span>
  );
}
