// import clsx from "clsx";
import Link from "next/link";
import { nplStatuses } from "@/lib/data/site";
import type { categories } from "@/lib/data/site-categories";
import { SiteNPLStatusIcon } from "../list";

export function StatusChip({
  status: key,
}: {
  status: keyof typeof nplStatuses;
}) {
  const status = nplStatuses[key as keyof typeof categories];
  return (
    <Link
      className="flex w-fit items-center gap-2 rounded-full border border-black/10 bg-black/5 py-1.5 pr-2.5 pl-3 font-semibold font-sans text-base text-neutral-800 text-trim-both tracking-normal transition-colors"
      href={`/npl/${key}`}
      style={{ viewTransitionName: key || undefined }}
    >
      <SiteNPLStatusIcon status={key} />
      <span className="text-trim-both">{status.label}</span>
    </Link>
  );
}
