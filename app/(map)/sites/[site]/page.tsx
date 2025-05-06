import { notFound } from "next/navigation";
import { SiteCard } from "./site";
import { allSites, findSiteById } from "@/lib/data/api";
import { MapZoom } from "../../zoom";
import { Nearby } from "./nearby";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { SiteNPLStatusTimeline } from "./timeline";
import { Contaminants } from "./contaminants";
import { Contact } from "./contact";
import { Database } from "@/supabase/types";

export const generateStaticParams = async () => {
  return allSites.map(({ id }) => ({ site: id }));
};

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
  // Fetch related images (TS: images table may not be in generated types)
  // @ts-ignore
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
      <SiteCard site={site} images={images || []}>
        {site.id === "NYD000606947" ? (
          <section className="border border-black/10 rounded-lg bg-black/2 p-4 mt-4">
            <h2 className="text-lg text-center text-neutral-600 font-bold font-sans tracking-tight">
              This was the very first Superfund site!
            </h2>
          </section>
        ) : null}
        <SiteNPLStatusTimeline site={site} />
        {Array.isArray(site.contaminants) && site.contaminants.length > 0 && (
          <Contaminants contaminants={site.contaminants} />
        )}
        {site.mapboxNearby && (
          <Nearby site={site} nearbyFeatures={site.mapboxNearby} />
        )}
        {site.contactName && <Contact site={site} />}
      </SiteCard>
    </>
  );
}
