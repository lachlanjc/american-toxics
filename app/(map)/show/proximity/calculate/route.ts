import { Site } from "@/lib/data/api";
import allSites from "@/lib/data/sites-mini.json" assert { type: "json" };
import { haversineDistance } from "@/lib/util/distance";

function getNearbySites(userLat: number, userLng: number) {
  const nearbySites = allSites
    .map((site) => {
      const distance = haversineDistance(site.lat, site.lng, userLat, userLng);
      return [distance, site];
    })
    .sort(([a], [b]) => b - a);
  return nearbySites;
}
