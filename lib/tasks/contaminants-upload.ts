import Slugger from "github-slugger";
import { supabase } from "@/lib/supabaseClient";
import { ContaminantList, prettifyChemicalName } from "@/lib/util/contaminants";

interface ContaminantRecord {
  id: string;
  name: string;
  contexts: string[];
  siteCount: number;
}

// Fetch all site contaminants
const { data: rows, error } = await supabase
  .from("sites")
  .select("contaminants")
  .not("contaminants", "is", null);
if (error) {
  console.error("Error fetching site contaminants:", error);
  process.exit(1);
}

// Flatten to a list of contaminant entries
const allContaminants: ContaminantList =
  rows?.flatMap((row) =>
    Array.isArray(row.contaminants) ? row.contaminants : [],
  ) ?? [];

// Extract unique names
const uniqueNames = Array.from(new Set(allContaminants.map((c) => c.name)));
// Count sites per contaminant
const siteCounts: Record<string, number> = {};
rows?.forEach((row) => {
  if (!Array.isArray(row.contaminants)) return;
  const seen = new Set<string>();
  row.contaminants.forEach((c) => {
    if (seen.has(c.name)) return;
    seen.add(c.name);
    siteCounts[c.name] = (siteCounts[c.name] || 0) + 1;
  });
});

// Build media counts per contaminant
const mediaCounts: Record<string, Record<string, number>> = {};
allContaminants.forEach(({ name: rawName, media }) => {
  mediaCounts[rawName] = mediaCounts[rawName] || {};
  mediaCounts[rawName][media] = (mediaCounts[rawName][media] || 0) + 1;
});

// Generate slugs, EPA URLs, and contexts
const slugger = new Slugger();
const records: ContaminantRecord[] = uniqueNames
  .filter((name) => name.length > 0)
  .filter(Boolean)
  .map((nameRaw) => {
    // Prettify chemical name and generate slug
    const name = prettifyChemicalName(nameRaw);
    const id = slugger.slug(name);
    // Determine most common media contexts for this contaminant
    const counts = mediaCounts[nameRaw] || {};
    const entries = Object.entries(counts);
    let contexts: string[] = [];
    if (entries.length > 0) {
      const maxCount = Math.max(...entries.map(([, c]) => c));
      contexts = entries.filter(([, c]) => c === maxCount).map(([m]) => m);
    }
    return { id, name, nameRaw, contexts, siteCount: siteCounts[nameRaw] || 0 };
  });

console.log(`Uploading ${records.length} contaminants...`);
const { error: upsertError } = await supabase
  .from("contaminants")
  .upsert(records, { onConflict: "id" });
if (upsertError) {
  console.error("Error uploading contaminants:", upsertError);
  process.exit(1);
}

console.log("Successfully uploaded contaminants.");
