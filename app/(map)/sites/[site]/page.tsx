import { notFound } from "next/navigation";
import { SiteCard } from "./site";
import { allSites, findSiteById } from "@/lib/data/api";
import { hasPlainSiteImage } from "@/lib/data/site";
import { MapZoom } from "../../zoom";

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
      <SiteCard site={site} />
      {hasPlainSiteImage(site.id) && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`/plainsite/${site.id}.`}
          width={1097 / 3}
          height={1080 / 3}
          alt={`Plain Site of ${site.name}`}
          className="floating-image"
        />
      )}
    </>
  );
}
