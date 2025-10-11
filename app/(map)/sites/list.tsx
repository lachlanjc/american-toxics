import clsx from "clsx";
import { Link } from "next-view-transitions";
import {
  nplStatuses,
  type SiteNPLStatus,
  type SupabaseSite,
} from "@/lib/data/site";
import { categories } from "@/lib/data/site-categories";

export type SiteListSite = Pick<
  SupabaseSite,
  "id" | "name" | "npl" | "city" | "stateCode"
> & { category?: SupabaseSite["category"] };

export function SiteNPLStatusIcon({
  status,
  className,
}: {
  status: SiteNPLStatus;
  className?: string;
}) {
  return (
    <span
      aria-label={status}
      className={clsx(
        "inline-block h-2 w-2 shrink-0 rounded-full bg-current",
        nplStatuses[status].color,
        className
      )}
      role="img"
    />
  );
}

export function SiteList({
  sites,
  ...props
}: {
  sites: Array<SiteListSite>;
} & React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul {...props}>
      {sites.map((result) => (
        <li key={result.id}>
          <Link
            className="grid w-full grid-cols-[8px_1fr] items-center gap-x-2 gap-y-1.5 py-1 pl-1 text-left text-black transition-colors hover:text-neutral-600"
            href={`/sites/${result.id}`}
            prefetch={false}
          >
            {result.npl ? <SiteNPLStatusIcon status={result.npl} /> : <span />}
            <strong
              className="font-normal font-sans text-base leading-tight"
              style={{ viewTransitionName: result.id }}
            >
              {result.name}
            </strong>
            <small className="col-start-2 block font-mono text-neutral-600 text-xs">
              {result.category ? (
                <>
                  {categories[result.category as keyof typeof categories].name}{" "}
                  &middot;{" "}
                </>
              ) : (
                ""
              )}
              {result.city}, {result.stateCode}
            </small>
          </Link>
        </li>
      ))}
    </ul>
  );
}
