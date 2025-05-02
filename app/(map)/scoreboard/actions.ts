"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { geocode } from "opencage-api-client";
import sitesMini from "@/lib/data/sites-mini.json";
import { haversineDistance } from "@/lib/util/distance";
import { supabase } from "@/lib/supabaseClient";

export async function handleSubmit(formData: FormData) {
  const addressRaw = formData.get("address")?.toString();
  if (!addressRaw) {
    return redirect("/scoreboard/new");
  }

  const apiKey = process.env.OPENCAGE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENCAGE_API_KEY in environment");
  }
  const geoRes = await geocode({ key: apiKey, q: addressRaw });
  if (!geoRes?.results?.length) {
    return redirect("/scoreboard/new");
  }
  const first = geoRes.results[0];
  const { lat, lng } = first.geometry;
  const addressFormatted = first.formatted;
  const comp: Record<string, unknown> = first.components || {};
  const addressCity = comp.city || comp.town || comp.village || "";
  const addressStateCode = comp.state_code || comp.state || "";

  const sitesWithDist: Array<{
    id: string;
    lat: number;
    lng: number;
    dist?: number;
  }> = structuredClone(sitesMini);

  const within1: string[] = [];
  const within5: string[] = [];
  const within10: string[] = [];
  const within20: string[] = [];
  const within50: string[] = [];
  for (const site of sitesWithDist) {
    const d = haversineDistance(lat, lng, site.lat, site.lng);
    site.dist = d;
    if (d <= 20) {
      if (d <= 2) within1.push(site.id);
      if (2 < d && d <= 5) within5.push(site.id);
      if (5 < d && d <= 10) within10.push(site.id);
      if (10 < d && d <= 20) within20.push(site.id);
      if (20 < d && d <= 50) within50.push(site.id);
    }
  }
  const siteNearestRecord = sitesWithDist.reduce((prev, curr) => {
    return (prev.dist || 0) < (curr.dist || 0) ? prev : curr;
  });
  const { id: siteNearest, dist: siteNearestMiles } = siteNearestRecord;

  const { data: created, error } = await supabase
    .from("scores")
    .insert([
      {
        lat,
        lng,
        addressRaw,
        addressFormatted,
        addressCity,
        addressStateCode,
        siteNearest,
        siteNearestMiles,
        sites1: within1,
        sites5: within5,
        sites10: within10,
        sites20: within20,
        sites50: within50,
      },
    ])
    .select("id")
    .single();
  if (error || !created) {
    console.error("Error saving score:", error);
    return redirect("/scoreboard/new");
  }
  revalidatePath("/scoreboard/results");
  return redirect(`/scoreboard/${created.id}`);
}
