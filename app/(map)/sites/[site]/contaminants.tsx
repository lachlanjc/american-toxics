import { WellRoot, WellTitle } from "@/lib/ui/well";
import { Link } from "next-view-transitions";
import SvgInfo from "@/lib/icons/Info";
import { ContaminantList, processContaminants } from "@/lib/util/contaminants";
import SvgChevronDown from "@/lib/icons/ChevronDown";
import clsx from "clsx";
import {
  contaminantContexts,
  type ContaminantContext,
  contaminantCategories,
} from "@/lib/data/contaminants";
import { supabase } from "@/lib/supabaseClient";

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
    <details className="mt-1">
      <summary className="flex gap-2 items-center cursor-pointer leading-tight overflow-clip">
        {Icon && (
          <Icon
            width={20}
            height={20}
            className={clsx(category.color, "-ml-px shrink-0")}
            aria-hidden
          />
        )}
        <span>
          <strong className="font-sans text-base font-medium">
            {context?.name}
          </strong>
          <small className="font-mono text-xs text-neutral-600 ml-1">
            ({contaminants.length} contaminant
            {contaminants.length === 1 ? "" : "s"})
          </small>
        </span>
        <SvgChevronDown
          width={20}
          height={20}
          className="-mr-1 ml-auto text-neutral-400 transition-transform in-open:rotate-180"
          aria-hidden
        />
      </summary>
      <p className="pl-7 pt-1 -ml-px text-xs mb-2 text-balance">
        {context.desc}
      </p>
      <ul
        className="pl-7 -ml-px text-neutral-600 text-xs flex flex-col gap-2"
        role="list"
      >
        {contaminants.map((contaminant) => {
          const linked = summarizedContaminants.find(
            (c) => c.name === contaminant,
          );
          return (
            <li key={contaminant}>
              {linked ? (
                <Link
                  href={`/contaminants/${linked.id}`}
                  className="underline underline-offset-3 decoration-neutral-400 transition-colors hover:text-primary hover:decoration-primary"
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
      <WellTitle className="flex items-center gap-2 mb-2">
        <span>Contamination</span>
        <Link href="/contaminants" className="-mb-1">
          <SvgInfo
            width={20}
            height={20}
            className="text-neutral-500 hover:text-neutral-700 transition-colors"
            aria-hidden
          />
          <span className="sr-only">Learn about contamination types</span>
        </Link>
      </WellTitle>
      {groups.map(([contextKey, sublist]) => (
        <ContaminantContext
          key={contextKey}
          title={contextKey}
          contaminants={processContaminants(sublist || [])}
          summarizedContaminants={summarizedContaminants || []}
        />
      ))}
    </WellRoot>
  );
}
