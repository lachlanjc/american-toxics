import { allSites as sites, Site } from "../data/api";

// ---- config ----
const radii = [1, 5, 10, 25, 50] as const; // miles
const R_EARTH_MI = 3958.8; // Earth radius in miles

// ---- helpers ----
const toRad = (deg: number) => (deg * Math.PI) / 180;

/** Great‑circle distance in miles (haversine) */
function distanceMiles(a: Site, b: Site): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R_EARTH_MI * Math.asin(Math.sqrt(h));
}

/** Compare two count maps from largest radius downward */
function isBetter(
  candidate: Record<number, number>,
  best: Record<number, number>,
) {
  for (let i = radii.length - 1; i >= 0; i--) {
    const r = radii[i];
    if (candidate[r] !== best[r]) return candidate[r] > best[r];
  }
  return false;
}

let bestIdx = -1;
let bestCounts: Record<number, number> = Object.fromEntries(
  radii.map((r) => [r, 0]),
);

sites.forEach((site, idx) => {
  const counts: Record<number, number> = Object.fromEntries(
    radii.map((r) => [r, 0]),
  );

  for (const other of sites) {
    const d = distanceMiles(site, other);
    radii.forEach((r) => {
      if (d <= r) counts[r] += 1;
    });
  }

  if (bestIdx === -1 || isBetter(counts, bestCounts)) {
    bestIdx = idx;
    bestCounts = counts;
  }
});

// ---- output ----
const center = sites[bestIdx];
console.log(`Lat/Lng of densest center: ${center.lat}, ${center.lng}`);
radii.forEach((r) =>
  console.log(`Sites within ${r.toString().padEnd(2)} mi: ${bestCounts[r]}`),
);
