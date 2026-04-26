import Link from "next/link";
import type { SupabaseSite } from "@/lib/data/site";
import { WellRoot, WellTitle } from "@/lib/ui/well";
import { CategoryChip } from "./category";
import { StatusChip } from "./status";

export function MiniSite({
  site,
  className,
}: {
  site: Pick<
    SupabaseSite,
    "id" | "name" | "city" | "stateCode" | "category" | "npl"
  >;
  className?: string;
}) {
  return (
    <WellRoot className={className} id={site.id}>
      <header className='flex gap-2 items-start'>
      <div className='flex-auto'>
      <WellTitle style={{ viewTransitionName: site.id }}>
        {site.name} Superfund Site
      </WellTitle>
      <div className="mt-1 text-neutral-600 text-sm">
        {site.city},{" "}
        <Link
          className="underline underline-offset-3 transition-colors hover:text-primary"
          href={`/states/${site.stateCode}`}
        >
          {site.stateCode}
        </Link>
      </div>
      </div>
      <Link
        className="action-button px-3 py-1.5 text-center font-medium font-display text-base shrink-0"
        href={`/sites/${site.id}`}
      >
        Open
      </Link>
      </header>
      <dl className="mt-4 grid grid-cols-2">
        <div>
          <dt className="mb-1 text-neutral-600 text-sm uppercase">Category</dt>
          <dd>
            {site.category ? <CategoryChip category={site.category} /> : "—"}
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-neutral-600 text-sm uppercase">
            Cleanup status
          </dt>
          <dd>{site.npl && <StatusChip status={site.npl} />}</dd>
        </div>
      </dl>
    </WellRoot>
  );
}
