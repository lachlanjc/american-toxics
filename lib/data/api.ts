import SITES from "./sites.json" assert { type: "json" };
import { Site } from "./site";
import { haversineDistance } from "../util/distance";
import { supabase } from "@/lib/supabaseClient";
import { SiteListSite } from "@/app/(map)/sites/list";
export type { Site } from "./site";
export type { SupabaseSite } from "./site";

export const allSites = SITES as Array<Site>;

export const findSiteById = (id: string) =>
  allSites.find((site) => site.id === id);

export async function getNearbySites(site: Site): Promise<Array<SiteListSite>> {
  // Fetch sites from Supabase
  const { data, error } = await supabase
    .from("sites")
    .select("id,name,lat,lng,category,npl,city,stateCode");
  if (error) {
    console.error("Error fetching nearby sites:", error);
    return [];
  }
  if (!data) {
    return [];
  }

  // Filter out the current site and compute distance <= 2 miles
  const nearbySites = data.filter((other) => {
    if (other.id === site.id) return false;
    if (other.lat == null || other.lng == null) return false;
    const distance = haversineDistance(
      site.lat,
      site.lng,
      other.lat,
      other.lng,
    );
    return distance <= 2;
  });

  return nearbySites;
}
