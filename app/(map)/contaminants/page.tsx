import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "next-view-transitions";
import { groupings } from "../sites/[site]/contaminants";
import {
  processContaminants,
  ContaminantList,
  prettifyChemicalName,
} from "@/lib/util/contaminants";
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
    .select("id, contaminants")
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

  // Stats
  // number of unique contaminant names
  const uniqueNamesCount = new Set(allContaminants.map((c) => c.name)).size;
  // average contaminants per site (excluding sites with zero)
  const sitesWithContaminants =
    rows?.filter(
      (row) => Array.isArray(row.contaminants) && row.contaminants.length > 0,
    ) ?? [];
  const totalSitesWithContaminants = sitesWithContaminants.length;
  const totalContaminants = sitesWithContaminants.reduce(
    (sum, row) => sum + row.contaminants.length,
    0,
  );
  const averageContaminantsPerSite =
    totalSitesWithContaminants > 0
      ? totalContaminants / totalSitesWithContaminants
      : 0;

  // Site with the most unique contaminant names
  interface Contam {
    name: string;
    media: string;
  }
  const siteWithMaxContaminants =
    sitesWithContaminants.length > 0
      ? sitesWithContaminants.reduce(
          (max, row) => {
            const count = new Set(row.contaminants.map((c: Contam) => c.name))
              .size;
            return count > max.count ? { site: row, count } : max;
          },
          {
            site: sitesWithContaminants[0],
            count: new Set(
              sitesWithContaminants[0].contaminants.map((c: Contam) => c.name),
            ).size,
          },
        )
      : null;
  // Top 5 most common contaminants across all sites
  const nameCounts: Record<string, number> = {};
  allContaminants.forEach((c) => {
    const name = prettifyChemicalName(c.name);
    nameCounts[name] = (nameCounts[name] ?? 0) + 1;
  });
  const topContaminants = Object.entries(nameCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 25)
    .map(([name, count]) => ({ name, count }));

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
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-neutral-600 text-xs uppercase">
              Categories of contamination
            </dt>
            <dd className="font-sans text-2xl">
              {Object.keys(groupings).length.toLocaleString("en-US")}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-600 text-xs uppercase">
              Unique contaminants
            </dt>
            <dd className="font-sans text-2xl">
              {uniqueNamesCount.toLocaleString("en-US")}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-600 text-xs uppercase">
              Avg contaminants per site
            </dt>
            <dd className="font-sans text-2xl">
              {averageContaminantsPerSite.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-600 text-xs uppercase">
              Site with most contaminants
            </dt>
            <dd className="font-sans text-2xl">
              <Link
                href={`/sites/${siteWithMaxContaminants!.site.id}`}
                className="underline underline-offset-4 transition-colors hover:text-primary"
              >
                {siteWithMaxContaminants!.count.toLocaleString("en-US")}
              </Link>
            </dd>
          </div>
        </dl>
        {/* Top most common contaminants */}
        <div>
          <h2 className="text-2xl font-sans font-bold mb-2">
            Top {topContaminants.length} most common contaminants
          </h2>
          <ol className="list-decimal list-inside ml-4 space-y-1">
            {topContaminants.map(({ name, count }) => (
              <li key={name} className="flex items-center">
                <span className="mr-2">{name}</span>
                <Count value={count} word="site" />
              </li>
            ))}
          </ol>
        </div>
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
