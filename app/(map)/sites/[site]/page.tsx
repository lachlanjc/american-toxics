import { notFound } from "next/navigation";
import { SiteCard } from "./site";
import { allSites, findSiteById } from "@/lib/data/api";
import { hasPlainSiteImage } from "@/lib/data/site";
import { MapZoom } from "../../zoom";
import { Nearby } from "./nearby";

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
    title: site.name,
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
  const site = findSiteById(siteId);
  if (!site) {
    return notFound();
  }

  return (
    <>
      <MapZoom center={[site.lat, site.lng]} />
      <SiteCard site={site}>
        <Nearby site={site} />
      </SiteCard>
    </>
  );
}
