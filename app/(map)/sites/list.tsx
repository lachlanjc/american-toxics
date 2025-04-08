import { nplStatuses, Site, SiteNPLStatus } from "@/lib/data/site";
import { Link } from "next-view-transitions";

function SiteNPLStatusIcon({
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
  // onSelect,
  ...props
}: {
  sites: Array<Site>;
  // onSelect?: (site: Site) => void;
} & React.ComponentPropsWithoutRef<"ul">) {
  return (
    <ul {...props}>
      {sites.map((result) => (
        <li key={result.id}>
          <Link
            href={`/sites/${result.id}`}
            className="border-b border-zinc-300 last:border-b-0 text-sm py-2 text-left transition-colors hover:text-neutral-600 w-full grid grid-cols-[8px_1fr] gap-x-2 gap-y-1 items-center"
            // onClick={() => {
            //   onSelect?.(result);
            // }}
          >
            <SiteNPLStatusIcon status={result.npl} />
            <strong
              className="font-sans font-medium"
              style={{ viewTransitionName: result.id }}
            >
              {result.name}
            </strong>
            <small className="text-neutral-500 font-mono block text-xs col-start-2">
              {result.city}, {result.stateCode}
            </small>
          </Link>
        </li>
      ))}
    </ul>
  );
}
