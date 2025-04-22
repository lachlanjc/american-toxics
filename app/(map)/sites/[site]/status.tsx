import { nplStatuses } from "@/lib/data/site";
import { categories } from "@/lib/data/site-categories";
// import clsx from "clsx";
import { Link } from "next-view-transitions";
import { SiteNPLStatusIcon } from "../list";

export function StatusChip({
  status: key,
}: {
  status: keyof typeof nplStatuses;
}) {
  const status = nplStatuses[key as keyof typeof categories];
  return (
    <Link
      href={`/npl/${key}`}
      className="flex items-center gap-2 w-fit font-sans rounded-full border border-black/10 px-3 py-2 text-trim-both text-base font-medium bg-black/5 tracking-normal text-neutral-800 transition-colors"
      style={{ viewTransitionName: key || undefined }}
    >
      <SiteNPLStatusIcon status={key} />
      <span className="text-trim-both">{status.label}</span>
    </Link>
  );
}
