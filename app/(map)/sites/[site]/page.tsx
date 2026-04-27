import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
// import { Database } from "@/supabase/types";
import { MapZoom } from "../../zoom";
import { Contact } from "./contact";
import { Contaminants } from "./contaminants";
import { Nearby } from "./nearby";
import { SiteCard } from "./site";
import { SiteNPLStatusTimeline } from "./timeline";

export const generateStaticParams = async () => {
  const { data } = await supabase.from("sites").select("id");
  return data?.map(({ id }) => ({ site: id })) ?? [];
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ site: string }>;
}) {
  const { site: siteId } = await params;
  const { data: site, error } = await supabase
    .from("sites")
    .select("name")
    .eq("id", siteId)
    .maybeSingle();
  if (error || !site) {
    notFound();
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
  const [siteResult, imagesResult] = await Promise.allSettled([
    supabase.from("sites").select("*").eq("id", siteId).maybeSingle(),
    supabase.from("images").select("*").eq("siteId", siteId),
  ]);

  const site =
    siteResult.status === "fulfilled" ? siteResult.value.data : undefined;
  const siteError =
    siteResult.status === "fulfilled"
      ? siteResult.value.error
      : siteResult.reason;
  if (siteError || !site) {
    console.error("Error fetching Supabase site data:", siteError);
    notFound();
  }

  const images =
    imagesResult.status === "fulfilled" ? imagesResult.value.data : [];
  const imagesError =
    imagesResult.status === "fulfilled"
      ? imagesResult.value.error
      : (imagesResult.reason as Error | undefined);
  if (imagesError) {
    console.error("Error fetching Supabase images:", imagesError);
  }

  return (
    <>
      <MapZoom center={[site.lat, site.lng]} />
      <SiteCard images={images || []} site={site}>
        {site.id === "NYD000606947" ? (
          <section className="mt-4 rounded-lg border border-black/10 bg-black/2 p-4">
            <h2 className="text-center font-bold font-display text-lg text-neutral-600 tracking-tight">
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
