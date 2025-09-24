// Task to import JSON site data into Supabase Postgres 'sites' table
// Written by @openai/codex

import { createClient } from "@supabase/supabase-js";
import sites from "@/lib/data/sites.json" with { type: "json" };

// Use server-side URL and service role key
const supabaseUrl =
  process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment",
  );
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

// Convert MM/DD/YYYY string to ISO (YYYY-MM-DD)
function toISO(dateStr: string): string {
  const [m, d, y] = dateStr.split("/");
  const mm = m.padStart(2, "0");
  const dd = d.padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

(async () => {
  try {
    const records = sites.map((site: any) => ({
      id: site.id,
      name: site.name,
      sems_id: site.semsId ? parseInt(site.semsId, 10) : null,
      city: site.city || null,
      county: site.county || null,
      lng: site.lng != null ? parseFloat(String(site.lng)) : null,
      lat: site.lat != null ? parseFloat(String(site.lat)) : null,
      date_proposed: site.dateProposed ? toISO(site.dateProposed) : null,
      date_listed: site.dateListed ? toISO(site.dateListed) : null,
      date_completed: site.dateCompleted ? toISO(site.dateCompleted) : null,
      date_noid:
        site.dateNOID || site.dateNoid
          ? toISO(site.dateNOID || site.dateNoid)
          : null,
      date_deleted: site.dateDeleted ? toISO(site.dateDeleted) : null,
      state_name: site.stateName || null,
      state_code: site.stateCode || null,
      npl: site.npl || null,
    }));

    const { error } = await supabaseAdmin
      .from("sites")
      .upsert(records, { onConflict: "id" });
    if (error) throw error;
    console.log(`Imported ${records.length} sites successfully.`);
  } catch (err: any) {
    console.error("Error importing sites:", err.message || err);
    process.exit(1);
  }
})();
