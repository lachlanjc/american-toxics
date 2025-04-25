import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "next-view-transitions";
import { groupings } from "../sites/[site]/contaminants";
import { processContaminants, ContaminantList } from "@/lib/util/contaminants";
import clsx from "clsx";
import { Count } from "@/lib/ui/count";
import type { Database } from "@/supabase/types";
import { Heading } from "@/lib/ui/typography";

type ContaminantRow = Database["public"]["Tables"]["contaminants"]["Row"];

export function metadata() {
  return {
    title: "Top Superfund Contaminants",
    description:
      "Top 25 most common toxic contaminants across U.S. Superfund sites.",
  };
}

export default async function ContaminantsPage() {
  // Fetch all site contaminants
  const { data: siteRows, error: siteError } = await supabase
    .from("sites")
    .select("id, name, contaminants")
    .not("contaminants", "is", null);
  if (siteError) {
    console.error("Error fetching site contaminants", siteError);
    throw new Error("Failed to load contaminants");
  }

  // Flatten all contaminants arrays
  const allContaminants: ContaminantList =
    siteRows?.flatMap((row) =>
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

  // Organize groups by category (ground, water, air, other)
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

  // Stats: unique names, average contaminants per site
  const uniqueNamesCount = new Set(allContaminants.map((c) => c.name)).size;
  const sitesWithContaminants =
    siteRows?.filter(
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

  // Fetch top 25 contaminants
  const { data: contRows, error: contError } = await supabase
    .from("contaminants")
    .select("id, name, contexts, siteCount")
    .not("siteCount", "is", null)
    .order("siteCount", { ascending: false })
    .limit(25);
  if (contError) {
    console.error("Error fetching precomputed contaminants", contError);
  }
  const topContaminants = contRows ?? [];
  const maxSiteCount = topContaminants.length
    ? (topContaminants[0].siteCount ?? 0)
    : 0;

  // Determine site with the most unique contaminants
  type Contam = { name: string; media: string };
  const siteWithMaxContaminants = (sitesWithContaminants || []).reduce(
    (max, row) => {
      const count = new Set(row.contaminants.map((c: Contam) => c.name)).size;
      return count > max.count ? { site: row, count } : max;
    },
    {
      site: sitesWithContaminants[0],
      count: new Set(
        sitesWithContaminants[0].contaminants.map((c: Contam) => c.name),
      ).size,
    },
  );

  return (
    <>
      <HeaderRoot showClose>
        <HeaderTitle>Contaminants</HeaderTitle>
        <HeaderSubtitle>
          These are the types of contamination found at Superfund sites, as
          defined by the EPA. Browse the top 25 by site count, then details by
          media category.
        </HeaderSubtitle>
      </HeaderRoot>
      <section className="flex flex-col gap-6 pt-2">
        {/* Stats */}
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-neutral-600 text-xs uppercase mb-1">
              Categories of contamination
            </dt>
            <dd className="font-sans text-lg">
              {Object.keys(groupings).length}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-600 text-xs uppercase mb-1">
              Unique contaminants
            </dt>
            <dd className="font-sans text-lg">
              {uniqueNamesCount.toLocaleString("en-US")}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-600 text-xs uppercase mb-1">
              Avg contaminants per site
            </dt>
            <dd className="font-sans text-lg">
              {averageContaminantsPerSite.toLocaleString("en-US", {
                maximumFractionDigits: 0,
              })}
            </dd>
          </div>
          <div>
            <dt className="text-neutral-600 text-xs uppercase mb-1">
              Max contaminants at a site
            </dt>
            <dd className="font-sans text-lg">
              {siteWithMaxContaminants && (
                <Link
                  href={`/sites/${siteWithMaxContaminants.site.id}`}
                  className="underline underline-offset-2"
                >
                  {siteWithMaxContaminants.count.toLocaleString("en-US")}
                </Link>
              )}
            </dd>
          </div>
        </dl>
        {/* Top 25 most common contaminants */}
        <div>
          <Heading>
            Top {topContaminants.length} most common contaminants
          </Heading>
          <ol role="list" className="space-y-1">
            {topContaminants.map((cont) => {
              const pct = maxSiteCount
                ? ((cont.siteCount ?? 0) * 100) / maxSiteCount
                : 0;
              const grouping = groupings[cont.contexts?.[0]];
              const Icon = grouping?.icon;
              return (
                <li key={cont.id}>
                  <Link
                    href={`/contaminants/${cont.id}`}
                    className="flex items-center gap-2 px-2 py-1 rounded-md transition-opacity hover:opacity-80"
                    style={{
                      backgroundImage: `linear-gradient(to right, hsl(0 0 0 / 5%) 0%, hsl(0 0 0 / 5%) ${pct}%, transparent ${pct}%, transparent 100%)`,
                    }}
                  >
                    {Icon && (
                      <Icon
                        width={24}
                        height={24}
                        className={clsx(grouping.color, "")}
                        aria-hidden
                      />
                    )}
                    <span className="font-sans text-lg">{cont.name}</span>
                    {cont.contexts && cont.contexts.length > 0 && (
                      <span className="ml-auto text-xs text-neutral-600">
                        {cont.siteCount} site{cont.siteCount === 1 ? "" : "s"}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ol>
        </div>
        {/* Group by media category */}
        {categories.map((cat) => {
          const groupsArr = byCategory[cat];
          if (!groupsArr.length) return null;
          const title = cat.charAt(0).toUpperCase() + cat.slice(1);
          return (
            <div key={cat}>
              <h2 className="text-3xl font-bold font-sans tracking-tight mb-4">
                {title}
              </h2>
              <div className="flex flex-col gap-4">
                {groupsArr.map(({ media, processed }) => {
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
                          <strong className="font-sans text-lg md:text-xl font-medium text-black mr-2">
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
