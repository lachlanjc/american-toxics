import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import {
  contaminantCategories,
  contaminantContexts,
} from "@/lib/data/contaminants";
import SvgClose from "@/lib/icons/Close";
import { supabase } from "@/lib/supabaseClient";
import { Count } from "@/lib/ui/count";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { HeadingL } from "@/lib/ui/typography";

export const metadata: Metadata = {
  title: "Top Superfund Contaminants",
  description:
    "Top 25 most common toxic contaminants across U.S. Superfund sites.",
};

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

  // Stats: unique names, average contaminants per site
  const uniqueNamesCount = new Set(allContaminants.map((c) => c.name)).size;
  const sitesWithContaminants =
    siteRows?.filter(
      (row) => Array.isArray(row.contaminants) && row.contaminants.length > 0
    ) ?? [];
  const totalSitesWithContaminants = sitesWithContaminants.length;
  const totalContaminants = sitesWithContaminants.reduce(
    (sum, row) => sum + row.contaminants.length,
    0
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
        sitesWithContaminants[0].contaminants.map((c: Contam) => c.name)
      ).size,
    }
  );

  return (
    <>
      <HeaderRoot>
        <HeaderTitle>Contaminants</HeaderTitle>
        <HeaderSubtitle>
          Explore where you can find contamination in the environment, as
          defined by EPA, plus the most common contaminants across Superfund
          sites.
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
                  className="underline underline-offset-4 transition-colors hover:text-primary"
                  href={`/sites/${siteWithMaxContaminants.site.id}`}
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
                        a.name.localeCompare(b.name)
                    );
                  return (
                    <details
                      className="rounded-lg border border-black/10 bg-black/2 px-4 py-3"
                      key={ctxKey}
                    >
                      <summary className="grid w-full cursor-zoom-in in-open:cursor-zoom-out grid-cols-[auto_1fr] items-start gap-x-3 outline-offset-4 focus-visible:overflow-clip">
                        <Icon
                          aria-hidden
                          className={clsx(cat.color, "-ml-2")}
                          height={48}
                          width={48}
                        />
                        <div className="self-center">
                          <div className="flex items-center gap-3">
                            <strong className="font-medium font-sans text-black text-lg md:text-xl">
                              {context.name}
                            </strong>
                            <Count
                              className="ml-0"
                              value={contaminants.length}
                              word="type"
                            />
                            <SvgClose
                              aria-hidden
                              className="-mr-1 ml-auto in-open:rotate-0 rotate-45 text-neutral-400 transition-transform"
                              height={20}
                              width={20}
                            />
                          </div>
                          {context.desc && (
                            <p className="mt-1 text-pretty text-neutral-600 leading-[1.625]">
                              {context.desc}
                            </p>
                          )}
                        </div>
                      </summary>
                      <ul className="flex flex-col gap-2 pt-4 pl-13 text-neutral-600 text-xs">
                        {contaminants.map((contam) => (
                          <li key={contam.id}>
                            {contam.summary ? (
                              <Link
                                className="underline underline-offset-4 transition-colors hover:text-primary"
                                href={`/contaminants/${contam.id}`}
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

        <hr className="-mx-6 border-black/20" />

        {/* Top 25 most common contaminants */}
        <section>
          <HeadingL className="mt-0 mb-4">
            Top {topContaminants.length} most common contaminants
          </HeadingL>
          <ol className="space-y-1">
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
                    className="flex items-center gap-2 rounded-md px-2 py-1 transition-opacity hover:opacity-80"
                    href={`/contaminants/${cont.id}`}
                    style={{
                      backgroundImage: `linear-gradient(to right, hsl(0 0 0 / 5%) 0%, hsl(0 0 0 / 5%) ${pct}%, transparent ${pct}%, transparent 100%)`,
                    }}
                  >
                    {Icon && (
                      <Icon
                        className={clsx(color, "")}
                        height={24}
                        title={`Most frequently occurs in ${context.name}`}
                        width={24}
                      />
                    )}
                    <span className="font-sans text-lg">{cont.name}</span>
                    <small className="font-mono">
                      {cont.summary ? "→" : null}
                    </small>
                    {cont.contexts && cont.contexts.length > 0 && (
                      <span className="ml-auto text-neutral-600 text-xs">
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
