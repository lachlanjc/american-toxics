import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "next-view-transitions";
import { processContaminants, ContaminantList } from "@/lib/util/contaminants";
import clsx from "clsx";
import { Count } from "@/lib/ui/count";
import { HeadingL } from "@/lib/ui/typography";
import {
  contaminantContexts,
  contaminantCategories,
} from "@/lib/data/contaminants";
import SvgClose from "@/lib/icons/Close";

export function metadata() {
  return {
    title: "Top Superfund Contaminants",
    description:
      "Top 25 most common toxic contaminants across U.S. Superfund sites.",
  };
}

export default async function ContaminantsPage() {
  // Fetch all contaminants
  const { data: allContaminants, error: contamError } = await supabase
    .from("contaminants")
    .select("id, name, contexts, siteCount, summary")
    .not("contexts", "is", null);
  if (contamError) {
    console.error("Error fetching contaminants", contamError);
    throw new Error("Failed to load contaminants");
  }

  // Fetch all sites’ contaminants
  const { data: siteRows, error: siteError } = await supabase
    .from("sites")
    .select("id, name, contaminants")
    .not("contaminants", "is", null);
  if (siteError) {
    console.error("Error fetching sites", siteError);
    throw new Error("Failed to load sites");
  }

  // Flatten all contaminants arrays
  const siteContaminants: ContaminantList =
    siteRows?.flatMap((row) =>
      Array.isArray(row.contaminants) ? row.contaminants : [],
    ) ?? [];

  // Group by media, dedupe and sort names
  const contamsByContext = Object.entries(
    Object.groupBy(siteContaminants, (c) => c.media),
  )
    .map(([media, list]) => ({
      media,
      processed: processContaminants(list || []),
    }))
    .filter(({ processed }) => processed.length > 0)
    .sort((a, b) => b.processed.length - a.processed.length);

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

  // Top 25 contaminants
  const contRows = allContaminants
    .filter((cont) => cont.siteCount !== null)
    .sort((a, b) => (b.siteCount ?? 0) - (a.siteCount ?? 0))
    .slice(0, 25);
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
      <HeaderRoot>
        <HeaderTitle>Contaminants</HeaderTitle>
        <HeaderSubtitle>
          The EPA categorizes contaminants by type, Browse the top contaminants,
          and a guide to the types of contamination, as defined by the EPA.
        </HeaderSubtitle>
      </HeaderRoot>
      <article className="flex flex-col gap-6 pt-2">
        {/* Stats */}
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="text-neutral-600 text-xs uppercase">
              Categories of contamination
            </dt>
            <dd className="font-sans text-2xl">
              {Object.keys(contaminantContexts).length}
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
              Max contaminants at a site
            </dt>
            <dd className="font-sans text-2xl">
              {siteWithMaxContaminants && (
                <Link
                  href={`/sites/${siteWithMaxContaminants.site.id}`}
                  className="underline underline-offset-4 transition-colors hover:text-primary"
                >
                  {siteWithMaxContaminants.count.toLocaleString("en-US")}
                </Link>
              )}
            </dd>
          </div>
        </dl>
        {/* Group by media category */}
        {Object.entries(contaminantCategories).map(([key, cat]) => {
          return (
            <div key={key}>
              <HeadingL>{cat.name}</HeadingL>
              <div className="flex flex-col gap-4">
                {cat.contexts.map((ctxKey) => {
                  const context = contaminantContexts[ctxKey];
                  const Icon = context.icon;
                  const contaminants = allContaminants
                    .filter((c) => c.contexts?.includes(ctxKey))
                    .sort(
                      (a, b) =>
                        // sort by siteCount then alphabetically
                        (b.siteCount ?? 0) - (a.siteCount ?? 0) ||
                        a.name.localeCompare(b.name),
                    );
                  return (
                    <details
                      key={ctxKey}
                      className="border border-black/10 rounded-lg bg-black/2 px-4 py-3"
                    >
                      <summary className="grid grid-cols-[auto_1fr] w-full gap-x-3 items-start cursor-zoom-in in-open:cursor-zoom-out focus-visible:overflow-clip outline-offset-4">
                        <Icon
                          width={48}
                          height={48}
                          className={clsx(cat.color, "-ml-2")}
                          aria-hidden
                        />
                        <div className="self-center">
                          <div className="flex items-center gap-3">
                            <strong className="font-sans text-lg md:text-xl font-medium text-black">
                              {context.name}
                            </strong>
                            <Count
                              value={contaminants.length}
                              word="type"
                              className="ml-0"
                            />
                            <SvgClose
                              width={20}
                              height={20}
                              className="-mr-1 ml-auto text-neutral-400 transition-transform rotate-45 in-open:rotate-0"
                              aria-hidden
                            />
                          </div>
                          {context.desc && (
                            <p className="mt-1 text-pretty text-neutral-600 leading-[1.625]">
                              {context.desc}
                            </p>
                          )}
                        </div>
                      </summary>
                      <ul
                        className="pl-13 pt-4 text-neutral-600 text-xs flex flex-col gap-2"
                        role="list"
                      >
                        {contaminants.map((contam) => (
                          <li key={contam.id}>
                            {contam.summary ? (
                              <Link
                                href={`/contaminants/${contam.id}`}
                                className="underline underline-offset-4 transition-colors hover:text-primary"
                              >
                                {contam.name}
                              </Link>
                            ) : (
                              contam.name
                            )}
                          </li>
                        ))}
                      </ul>
                    </details>
                  );
                })}
              </div>
            </div>
          );
        })}

        <hr className="border-black/20 -mx-6" />

        {/* Top 25 most common contaminants */}
        <section>
          <HeadingL className="mt-0 mb-4">
            Top {topContaminants.length} most common contaminants
          </HeadingL>
          <ol role="list" className="space-y-1">
            {topContaminants.map((cont) => {
              const pct = maxSiteCount
                ? ((cont.siteCount ?? 0) * 100) / maxSiteCount
                : 0;
              const context = contaminantContexts[cont.contexts?.[0]];
              const Icon = context?.icon;
              const color = contaminantCategories[context?.category]?.color;
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
                        className={clsx(color, "")}
                        title={`Most frequently occurs in ${context.name}`}
                      />
                    )}
                    <span className="font-sans text-lg">{cont.name}</span>
                    <small className="font-mono">
                      {cont.summary ? "→" : null}
                    </small>
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
        </section>
      </article>
    </>
  );
}
