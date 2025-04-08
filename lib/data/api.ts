import SITES from "./sites.json" assert { type: "json" };
import { Site } from "./site";
import { haversineDistance } from "../util/distance";
export type { Site } from "./site";

export const allSites = SITES as Array<Site>;

export const findSiteById = (id: string) =>
  allSites.find((site) => site.id === id);

export function getNearbySites(site: Site) {
  const nearbySites = allSites.filter((otherSite) => {
    if (otherSite.id === site.id) return false;
    const distance = haversineDistance(
      site.lat,
      site.lng,
      otherSite.lat,
      otherSite.lng,
    );
    return distance <= 7.5; // Adjust the distance threshold as needed
  });
  return nearbySites;
}
