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

export function formatAcres(acres: number | null) {
  let round = acres
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
