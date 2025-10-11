// import Image from "next/image";
import { notFound } from "next/navigation";
import { allSites, findSiteById } from "@/lib/data/api";
import { supabase } from "@/lib/supabaseClient";
// import { Database } from "@/supabase/types";
import { MapZoom } from "../../zoom";
import { Contact } from "./contact";
import { Contaminants } from "./contaminants";
import { Nearby } from "./nearby";
import { SiteCard } from "./site";
import { SiteNPLStatusTimeline } from "./timeline";

export const generateStaticParams = async () =>
  allSites.map(({ id }) => ({ site: id }));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteId } = await params;
  const site = findSiteById(siteId);
  if (!site) {
    return notFound();
  }
  return {
    title: `${site.name} Superfund Site`,
    // description: ,
  };
}

export const fetchCache = "force-cache";

export default async function Page({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteId } = await params;
  const { data: site, error } = await supabase
    .from("sites")
    .select("*")
    .eq("id", siteId)
    .maybeSingle();
  if (error || !site) {
    console.error("Error fetching Supabase site data:", error);
    return notFound();
  }
  // Fetch related images for this site
  const { data: images, error: imagesError } = await supabase
    .from("images")
    .select("*")
    .eq("siteId", siteId);
  if (imagesError) {
    console.error("Error fetching Supabase images:", imagesError);
  }

  return (
    <>
      <MapZoom center={[site.lat, site.lng]} />
      <SiteCard images={images || []} site={site}>
        {site.id === "NYD000606947" ? (
          <section className="mt-4 rounded-lg border border-black/10 bg-black/2 p-4">
            <h2 className="text-center font-bold font-sans text-lg text-neutral-600 tracking-tight">
              This was the very first Superfund site!
            </h2>
          </section>
        ) : null}
        <SiteNPLStatusTimeline site={site} />
        {Array.isArray(site.contaminants) && site.contaminants.length > 0 && (
          <Contaminants contaminants={site.contaminants} />
        )}
        {site.mapboxNearby && (
          <Nearby nearbyFeatures={site.mapboxNearby} site={site} />
        )}
        {site.contactName && <Contact site={site} />}
      </SiteCard>
    </>
  );
}
