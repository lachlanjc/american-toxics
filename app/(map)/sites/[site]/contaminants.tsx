import clsx from "clsx";
import Link from "next/link";
import {
  type ContaminantContext,
  contaminantCategories,
  contaminantContexts,
} from "@/lib/data/contaminants";
import SvgChevronDown from "@/lib/icons/ChevronDown";
import SvgInfo from "@/lib/icons/Info";
import { supabase } from "@/lib/supabaseClient";
import { WellRoot, WellTitle } from "@/lib/ui/well";
import {
  type ContaminantList,
  processContaminants,
} from "@/lib/util/contaminants";

function ContaminantContext({
  title,
  contaminants,
  summarizedContaminants,
}: React.PropsWithChildren<{
  title: string;
  contaminants: Array<string>;
  summarizedContaminants: Array<{ id: string; name: string }>;
}>) {
  const context: ContaminantContext | undefined = contaminantContexts[title];
  const Icon = context?.icon as React.FC<React.SVGProps<SVGSVGElement>>;
  const category = contaminantCategories[context?.category];
  return (
    <details className="mt-1.5">
      <summary className="flex cursor-pointer items-center gap-2 overflow-clip leading-tight">
        {Icon && (
          <Icon
            aria-hidden
            className={clsx(category.color, "-ml-px shrink-0")}
            height={20}
            width={20}
          />
        )}
        <span>
          <strong className="font-medium font-sans text-base">
            {context?.name}
          </strong>
          <small className="ml-1 font-mono text-neutral-600 text-xs">
            ({contaminants.length} contaminant
            {contaminants.length === 1 ? "" : "s"})
          </small>
        </span>
        <SvgChevronDown
          aria-hidden
          className="-mr-1 ml-auto in-open:rotate-180 text-neutral-400 transition-transform"
          height={20}
          width={20}
        />
      </summary>
      <p className="-ml-px mb-2 text-balance pl-7 font-sans text-base">
        {context.desc}
      </p>
      <ul className="-ml-px flex flex-col gap-2 pl-7 text-neutral-600 text-xs">
        {contaminants.map((contaminant) => {
          const linked = summarizedContaminants.find(
            (c) => c.name === contaminant
          );
          return (
            <li key={contaminant}>
              {linked ? (
                <Link
                  className="underline decoration-neutral-400 underline-offset-3 transition-colors hover:text-primary hover:decoration-primary"
                  href={`/contaminants/${linked.id}`}
                >
                  {contaminant}
                </Link>
              ) : (
                contaminant
              )}
            </li>
          );
        })}
      </ul>
    </details>
  );
}

type ContaminantGroup = [
  keyof typeof contaminantContexts,
  Array<{ name: string; media: string }>,
];

export async function Contaminants({
  contaminants = [],
}: {
  contaminants: ContaminantList;
}) {
  const { data: summarizedContaminants, error } = await supabase
    .from("contaminants")
    .select("id, name")
    .not("summary", "is", null);
  // .in("name", contaminants.map((c) => c.name));
  if (error) {
    console.error("Error fetching contaminant links:", error);
    return null;
  }
  const groups = Object.keys(contaminantContexts)
    .map((key) => {
      const values = contaminants.filter((c) => c.media === key);
      return [key, values] as ContaminantGroup;
    })
    .filter((g) => Array.isArray(g[1]) && g[1].length > 0)
    .sort((a: ContaminantGroup, b: ContaminantGroup) => {
      const categoryA = contaminantContexts[a[0]].category;
      const categoryB = contaminantContexts[b[0]].category;
      // sort by category of group, then number of contaminants (desc)
      return (
        (categoryA === categoryB ? 0 : categoryA < categoryB ? 1 : -1) ||
        (a[1].length === b[1].length ? 0 : a[1].length > b[1].length ? -1 : 1)
      );
    });
  return (
    <WellRoot>
      <WellTitle className="mb-3 flex items-center gap-2">
        <span>Contamination</span>
        <Link className="-mb-1" href="/contaminants">
          <SvgInfo
            aria-hidden
            className="text-neutral-500 transition-colors hover:text-neutral-700"
            height={20}
            width={20}
          />
          <span className="sr-only">Learn About Contamination Types</span>
        </Link>
      </WellTitle>
      {groups.map(([contextKey, sublist]) => (
        <ContaminantContext
          contaminants={processContaminants(sublist || [])}
          key={contextKey}
          summarizedContaminants={summarizedContaminants || []}
          title={contextKey}
        />
      ))}
    </WellRoot>
  );
}
