import { Site } from "@/lib/data/site";
import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";

export function SiteList({
  sites,
  onSelect,
  ...props
}: {
  sites: Array<Site>;
  onSelect?: (site: Site) => void;
} & ComponentPropsWithoutRef<"ul">) {
  return (
    <ul {...props}>
      {sites.map((result) => (
        <li key={result.id}>
          <Link
            href={`/sites/${result.id}`}
            className="border-b border-zinc-300 last:border-b-0 text-xs py-2 text-left hover:opacity-80 transition-opacity w-full"
            // onClick={() => {
            //   onSelect?.(result);
            // }}
          >
            {result.name}
            <small className="text-zinc-500 block mt-1">
              {result.city}, {result.stateCode}
            </small>
          </Link>
        </li>
      ))}
    </ul>
  );
}
