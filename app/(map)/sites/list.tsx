import { nplStatuses, Site, SiteNPLStatus } from "@/lib/data/site";
import { Link } from "next-view-transitions";

export function SiteNPLStatusIcon({
  status,
  className,
}: {
  status: SiteNPLStatus;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={status}
      className={`inline-block w-2 h-2 rounded-full ${nplStatuses[status].color} bg-current ${className ?? ""}`}
    />
  );
}

export function SiteList({
  sites,
  ...props
}: {
  sites: Array<Pick<Site, "id" | "name" | "npl" | "city" | "stateCode">>;
} & React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul {...props}>
      {sites.map((result) => (
        <li key={result.id}>
          <Link
            href={`/sites/${result.id}`}
            className="py-1 text-left transition-colors text-black hover:text-neutral-600 w-full grid grid-cols-[8px_1fr] pl-1 gap-x-2 gap-y-1 items-center"
            prefetch={false}
          >
            <SiteNPLStatusIcon status={result.npl} />
            <strong
              className="font-sans text-base font-normal"
              style={{ viewTransitionName: result.id }}
            >
              {result.name}
            </strong>
            <small className="text-neutral-600 font-mono block text-xs col-start-2">
              {result.city}, {result.stateCode}
            </small>
          </Link>
        </li>
      ))}
    </ul>
  );
}
