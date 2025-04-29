import Slugger from "github-slugger";
import { supabase } from "@/lib/supabaseClient";
import { ContaminantList, prettifyChemicalName } from "@/lib/util/contaminants";

/**
 * Script to calculate and update context (media types) and site counts
 * for each contaminant based on site data.
 */
// Fetch all site contaminants
const { data: rows, error: fetchErr } = await supabase
  .from("sites")
  .select("contaminants")
  .not("contaminants", "is", null)
  .not("contaminants", "eq", "[]");
if (fetchErr) {
  console.error(
    "Error fetching site contaminants:",
    fetchErr.message || fetchErr,
  );
  process.exit(1);
}

// Flatten to a list of contaminant entries
const allContaminants: ContaminantList =
  rows?.flatMap((row) =>
    Array.isArray(row.contaminants) ? row.contaminants : [],
  ) ?? [];

// Gather unique media types for reporting
const uniqueMedia = Array.from(new Set(allContaminants.map((c) => c.media)));
console.log("Found media types:", uniqueMedia.sort());

// Extract unique contaminant names
const uniqueNames = Array.from(new Set(allContaminants.map((c) => c.name)));

// Count the number of distinct sites for each contaminant
const siteCounts: Record<string, number> = {};
rows?.forEach((row) => {
  if (!Array.isArray(row.contaminants)) return;
  const seen = new Set<string>();
  row.contaminants.forEach((c) => {
    const rawName = c.name;
    if (seen.has(rawName)) return;
    seen.add(rawName);
    siteCounts[rawName] = (siteCounts[rawName] || 0) + 1;
  });
});

// Count occurrences of each media context per contaminant
const mediaCounts: Record<string, Record<string, number>> = {};
allContaminants.forEach(({ name: rawName, media }) => {
  mediaCounts[rawName] = mediaCounts[rawName] || {};
  mediaCounts[rawName][media] = (mediaCounts[rawName][media] || 0) + 1;
});

// Build update records
const slugger = new Slugger();
await Promise.all(
  uniqueNames.map(async (nameRaw) => {
    // Prettify and slugify the contaminant name
    const pretty = prettifyChemicalName(nameRaw);
    const id = slugger.slug(pretty);
    // Number of sites containing this contaminant
    const siteCount = siteCounts[nameRaw] || 0;
    // Determine most frequent media contexts
    const counts = mediaCounts[nameRaw] || {};
    const entries = Object.entries(counts);
    let contexts: string[] = [];
    if (siteCount <= 3) {
      // rare contaminant: show all media contexts
      contexts = entries.map(([m]) => m);
    } else {
      // common contaminant: only show media with ≥3 occurrences
      contexts = entries.filter(([, c]) => c >= 3).map(([m]) => m);
    }
    const update = { contexts, siteCount };
    const { error } = await supabase
      .from("contaminants")
      .update(update)
      .eq("id", id);
    if (error) {
      console.error(`Error updating ${id}:`, error.message || error);
    }
  }),
);

console.log("Successfully updated contaminant contexts and site counts.");
