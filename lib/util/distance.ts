// o3 wrote all of this code

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/** Returns distance in miles between coordinate pairs */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 3959; // Radius of the Earth in miles

  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.asin(Math.sqrt(a));

  return R * c; // Distance in miles
}

/**
 * Initial bearing (forward azimuth) from (latA,lngA) ➜ (latB,lngB), in degrees.
 *   0° = due N, 90° = due E, 180° = due S, 270° = due W.
 */
export function bearingDeg(
  latA: number,
  lngA: number,
  latB: number,
  lngB: number,
): number {
  const φ1 = toRadians(latA);
  const φ2 = toRadians(latB);
  const Δλ = toRadians(lngB - lngA);

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x =
    Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360; // normalize 0‑360
}

/**
 * Convert bearing to a cardinal / inter‑cardinal label.
 *   precision = 4  → N, E, S, W
 *   precision = 8  → N, NE, E, SE, S, SW, W, NW   (default)
 */
export function bearingToCardinal(
  bearing: number,
  precision: 4 | 8 = 8,
): string {
  const labels =
    precision === 4
      ? ["N", "E", "S", "W"]
      : ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

  const sector = 360 / labels.length; // 90° or 45°
  const idx = Math.round(bearing / sector) % labels.length; // wrap 360→0
  return labels[idx];
}

export function coordsToCardinal(
  latA: number,
  lngA: number,
  latB: number,
  lngB: number,
): string {
  const bearing = bearingDeg(latA, lngA, latB, lngB);
  return bearingToCardinal(bearing);
}

export function formatAcres(acres: number | null) {
  const round = acres
    ? Number(
        acres.toLocaleString("en-US", {
          maximumFractionDigits: 0,
        }),
      )
    : null;
  return round
    ? [0, 1].includes(round)
      ? `${acres === 0 ? "<" : ""}1 acre`
      : `${round} acres`
    : "—";
}
