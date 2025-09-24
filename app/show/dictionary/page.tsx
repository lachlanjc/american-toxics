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
    new Set(siteContaminants.map((c) => slug(c.name))),
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
    <main className="font-sans grid grid-cols-2" style={{ fontSize: 12 }}>
      {/* Table of contents */}
      <article key="toc" className="p-8 flex flex-col w-[50vi] h-[50vb]">
        <h1 className="text-[2em] leading-none font-semibold">Contaminants</h1>
        <nav
          aria-label="Table of contents"
          className="mt-4 flex flex-col gap-0"
        >
          {sorted.map((contaminant, i) => (
            <a
              key={contaminant.id}
              href={`#${contaminant.id}`}
              className="flex justify-between"
            >
              {contaminant.name}
              <span className="text-neutral-400 font-mono text-[0.75em] tabular-nums">
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
              .map((c) => c.media),
          ),
        );
        return (
          <article
            id={contaminant.id}
            key={contaminant.id}
            className="p-8 flex flex-col w-[50vi] h-[50vb]"
            // style={{ scale: 2 }}
          >
            <h2 className="text-[2em] text-balance leading-none font-semibold">
              {contaminant.name}
            </h2>
            {contaminant.summary && (
              <p className="mt-4 font-mono text-[1em] text-neutral-700 text-pretty flex-grow">
                {contaminant.summary.replaceAll("*", "")}
              </p>
            )}
            <div className="mt-auto flex flex-col font-medium text-[1.5em]">
              {contexts.map((ctx) => {
                const context = contaminantContexts[ctx];
                if (!context) return null;
                const Icon = context.icon;
                const color = contaminantCategories[context.category]?.color;
                return (
                  <div className="flex items-center gap-2 -ml-1" key={ctx}>
                    <Icon
                      width="2em"
                      height="2em"
                      className={clsx(color)}
                      aria-hidden
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
