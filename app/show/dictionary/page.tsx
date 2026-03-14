import clsx from "clsx";
import { slug } from "github-slugger";
import {
  contaminantCategories,
  contaminantContexts,
} from "@/lib/data/contaminants";
import { supabase } from "@/lib/supabaseClient";

export const metadata = { title: "Dictionary" };

export default async function Page() {
  // Fetch contaminants for the site PAD000436261
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("contaminants")
    .eq("id", "PAD000436261")
    .single();
  if (siteError) {
    console.error("Error fetching site:", siteError);
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-red-600">Error loading contaminants.</p>
      </main>
    );
  }
  const raw = site?.contaminants;
  const siteContaminants = Array.isArray(raw)
    ? (raw as Array<{ name: string; media: string }>)
    : [];
  if (siteContaminants.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <p>No contaminants found for site PAD000436261.</p>
      </main>
    );
  }
  // Generate slugs (IDs) from raw contaminant names
  const uniqueIds = Array.from(
    new Set(siteContaminants.map((c) => slug(c.name)))
  );
  // Fetch full contaminant records
  // Fetch full contaminant records by slugged IDs
  const { data: contaminants, error: contamError } = await supabase
    .from("contaminants")
    .select("id, name, summary")
    .in("id", uniqueIds);
  if (contamError || !contaminants) {
    console.error("Error fetching contaminants:", contamError);
    return (
      <main className="container mx-auto px-4 py-8">
        <p className="text-red-600">Error loading contaminants dictionary.</p>
      </main>
    );
  }
  // Sort alphabetically by name, but move any entries starting with a digit to the end
  const sorted = [...contaminants].sort((a, b) => {
    const aStartsNum = /^\d/.test(a.name);
    const bStartsNum = /^\d/.test(b.name);
    // If one starts with a digit and the other doesn't, digit-first entries go last
    if (aStartsNum !== bStartsNum) {
      return aStartsNum ? 1 : -1;
    }
    // Otherwise, sort alphabetically
    return a.name.localeCompare(b.name);
  });
  return (
    <main className="grid grid-cols-2 font-sans" style={{ fontSize: 12 }}>
      {/* Table of contents */}
      <article className="flex h-[50vb] w-[50vi] flex-col p-8" key="toc">
        {/*<h1 className="font-semibold text-[2em] leading-none mb-4">Contaminants</h1>*/}
        <nav
          aria-label="Table of contents"
          className="leading-4 flex flex-col gap-px"
        >
          {sorted.map((contaminant, i) => (
            <a
              className="flex justify-between"
              href={`#${contaminant.id}`}
              key={contaminant.id}
            >
              {contaminant.name}
              <span className="font-mono text-[0.75em] text-neutral-400 tabular-nums">
                {i + 1}
              </span>
            </a>
          ))}
        </nav>
      </article>
      {sorted.map((contaminant) => {
        // Collect contexts for this contaminant by matching slug(c.name) to contaminant.id
        const contexts = Array.from(
          new Set(
            siteContaminants
              .filter((c) => slug(c.name) === contaminant.id)
              .map((c) => c.media)
          )
        );
        return (
          <article
            className="flex h-[50vb] w-[50vi] flex-col p-8"
            id={contaminant.id}
            key={contaminant.id}
            // style={{ scale: 2 }}
          >
            <h2 className="text-balance font-semibold text-[2em] leading-none">
              {contaminant.name}
            </h2>
            {contaminant.summary && (
              <p className="mt-4 grow text-pretty font-mono text-[1em] text-neutral-700">
                {contaminant.summary.replaceAll("*", "")}
              </p>
            )}
            <div className="mt-auto flex flex-wrap gap-x-6 font-medium text-[1.5em]">
              {contexts.map((ctx) => {
                const context = contaminantContexts[ctx];
                if (!context) return null;
                const Icon = context.icon;
                const color = contaminantCategories[context.category]?.color;
                return (
                  <div className="-ml-1 flex items-center gap-2" key={ctx}>
                    <Icon
                      aria-hidden
                      className={clsx(color)}
                      height="2em"
                      width="2em"
                    />
                    {context.name}
                  </div>
                );
              })}
            </div>
          </article>
        );
      })}
    </main>
  );
}
