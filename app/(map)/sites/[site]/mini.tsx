import { SupabaseSite } from "@/lib/data/site";
import { WellRoot, WellTitle } from "@/lib/ui/well";
import { Link } from "next-view-transitions";
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
      <WellTitle style={{ viewTransitionName: site.id }}>
        {site.name} Superfund Site
      </WellTitle>
      <div className="text-neutral-600 text-xs mt-1">
        {site.city},{" "}
        <Link
          href={`/states/${site.stateCode}`}
          className="underline underline-offset-3 hover:text-primary transition-colors"
        >
          {site.stateCode}
        </Link>
      </div>
      <dl className="grid grid-cols-2 my-4">
        <div>
          <dt className="text-neutral-600 text-xs uppercase mb-1">Category</dt>
          <dd>
            {site.category ? <CategoryChip category={site.category} /> : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-600 text-xs uppercase mb-1">
            Cleanup status
          </dt>
          <dd>{site.npl && <StatusChip status={site.npl} />}</dd>
        </div>
      </dl>
      <Link
        href={`/sites/${site.id}`}
        className="text-center action-button font-sans font-bold text-base py-1.5 block"
      >
        Learn about this site
      </Link>
    </WellRoot>
  );
}
