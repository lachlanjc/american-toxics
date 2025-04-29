import { supabase } from "@/lib/supabaseClient";
import { slug } from "github-slugger";
import {
  contaminantContexts,
  contaminantCategories,
} from "@/lib/data/contaminants";
import clsx from "clsx";

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
  // Sort alphabetically by name
  const sorted = [...contaminants].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <main className="font-sans">
      <div className="grid grid-cols-2 border-1 border-b-0 border-dashed border-neutral-100">
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
              key={contaminant.id}
              className="p-6 flex flex-col border-b border border-dashed border-neutral-100 even:border-l even:pr-10 odd:pl-10 h-[50vh]"
            >
              <h2 className="text-2xl font-semibold">{contaminant.name}</h2>
              {contaminant.summary && (
                <p className="mt-2 font-mono text-xs text-neutral-700 flex-grow">
                  {contaminant.summary}
                </p>
              )}
              <div className="mt-4 flex flex-col gap-1">
                {contexts.map((ctx) => {
                  const context = contaminantContexts[ctx];
                  if (!context) return null;
                  const Icon = context.icon;
                  const color = contaminantCategories[context.category]?.color;
                  return (
                    <div className="flex items-center gap-2" key={ctx}>
                      <Icon
                        width={32}
                        height={32}
                        className={clsx(color)}
                        aria-hidden
                      />
                      <strong className="font-medium">{context.name}</strong>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
