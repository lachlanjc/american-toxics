import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { supabase } from "@/lib/supabaseClient";
import { groupings } from "../sites/[site]/contaminants";
import { processContaminants, ContaminantList } from "@/lib/util/contaminants";
import clsx from "clsx";
import { Count } from "@/lib/ui/count";

export function metadata() {
  return {
    title: "Contaminants",
    description:
      "All contaminants across all Superfund sites, grouped by media",
  };
}

export default async function ContaminantsPage() {
  const { data: rows, error } = await supabase
    .from("sites")
    .select("contaminants")
    .not("contaminants", "is", null);

  if (error) {
    console.error("Error fetching contaminants", error);
    throw new Error("Failed to load contaminants");
  }

  // Flatten all contaminants arrays
  const allContaminants: ContaminantList =
    rows?.flatMap((row) =>
      Array.isArray(row.contaminants) ? row.contaminants : [],
    ) ?? [];

  // Group by media, dedupe and sort names
  const grouped = Object.entries(
    Object.groupBy(allContaminants, (c) => c.media),
  )
    .map(([media, list]) => ({
      media,
      processed: processContaminants(list || []),
    }))
    .filter(({ processed }) => processed.length > 0)
    .sort((a, b) => b.processed.length - a.processed.length);

  // Organize groups by category (ground, water, air)
  const categories = ["ground", "water", "air", "other"] as const;
  type Category = (typeof categories)[number];
  const byCategory: Record<
    Category,
    Array<{ media: string; processed: string[] }>
  > = {
    ground: [],
    water: [],
    air: [],
    other: [],
  };
  grouped.forEach(({ media, processed }) => {
    if (["Residuals", "Other"].includes(media)) {
      byCategory.other.push({ media, processed });
      return;
    }
    const cat = groupings[media]?.category as Category | undefined;
    if (cat && categories.includes(cat)) {
      byCategory[cat].push({ media, processed });
    }
  });

  return (
    <>
      <HeaderRoot showClose>
        <HeaderTitle>Contaminants</HeaderTitle>
        <HeaderSubtitle>
          These are the types of contamination found at Superfund sites, as
          defined by the EPA. Click categories to see the full list of
          contaminants.
        </HeaderSubtitle>
      </HeaderRoot>
      <section className="flex flex-col gap-8 pt-2">
        {categories.map((cat) => {
          const groups = byCategory[cat];
          if (!groups.length) return null;
          const title = cat.charAt(0).toUpperCase() + cat.slice(1);
          return (
            <div key={cat}>
              <h2 className="text-3xl font-bold font-sans tracking-tight mb-4">
                {title}
              </h2>
              <div className="flex flex-col gap-4">
                {groups.map(({ media, processed }) => {
                  const grouping = groupings[media];
                  if (!grouping) return null;
                  const Icon = grouping.icon;
                  return (
                    <details
                      key={media}
                      className="border border-black/10 rounded-lg bg-black/2 px-4 py-3"
                    >
                      <summary className="grid grid-cols-[auto_1fr] w-full gap-x-3 items-start cursor-pointer">
                        <Icon
                          width={48}
                          height={48}
                          className={clsx(grouping.color, "-ml-2")}
                          aria-hidden
                        />
                        <div className="">
                          <strong className="font-sans text-lg md:text-2xl font-medium text-black mr-2">
                            {grouping.label || media}
                          </strong>
                          <Count value={processed.length} word="" />
                          {grouping.desc && (
                            <p className="mt-1 text-pretty text-neutral-600 leading-[1.625]">
                              {grouping.desc}
                            </p>
                          )}
                        </div>
                      </summary>
                      <ul
                        className="pl-13 pt-4 text-neutral-600 text-xs flex flex-col gap-2"
                        role="list"
                      >
                        {processed.map((name) => (
                          <li key={name}>{name}</li>
                        ))}
                      </ul>
                    </details>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
