import type { Database } from "@/supabase/types";
import { supabase } from "@/lib/supabaseClient";
import ResultsViewer, { ResultItem } from "./ResultsViewer";

export default async function ResultsPage() {
  // type ScoreRaw = Database["public"]["Tables"]["scores"]["Row"];
  type SiteRow = Database["public"]["Tables"]["sites"]["Row"];

  // Fetch top 50 scores sorted by nearest site distance
  const { data: scores, error } = await supabase
    .from("scores")
    .select(
      "id, createdAt, addressCity, addressStateCode, siteNearest, siteNearestMiles, sites10",
    )
    .order("siteNearestMiles", { ascending: true })
    .limit(50);
  if (error || !scores) {
    throw new Error("Error fetching scores");
  }

  // Gather nearest site IDs
  const nearestIds = scores
    .map((s) => s.siteNearest)
    .filter((id): id is string => Boolean(id));
  // Fetch nearest site details
  const { data: siteRecords, error: siteError } = await supabase
    .from("sites")
    .select("id,name,lat,lng,category,npl,city,stateCode")
    .in("id", nearestIds);
  if (siteError || !siteRecords) {
    throw new Error("Error fetching site details");
  }
  const siteMap = new Map(siteRecords.map((s) => [s.id, s]));

  // Construct result items
  const results: ResultItem[] = scores.map((s) => ({
    ...s,
    nearestMiles: s.siteNearestMiles ?? 0,
    sites10Count: s.sites10?.length ?? 0,
    nearestSite: siteMap.get(s.siteNearest!) as SiteRow,
  }));

  return <ResultsViewer initialResults={results} />;
}
