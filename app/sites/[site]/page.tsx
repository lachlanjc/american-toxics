import { notFound } from "next/navigation";
import { SiteCard } from "./site";
import SITES from "@/lib/data/sites.json" assert { type: "json" };

function getSite(id: string) {
  const site = SITES.find((site) => site.id === id);
  return site;
}

export async function generateMetadata({
  params,
}: {
  params: { site: string };
}) {
  const { site: siteId } = await params;
  const site = getSite(siteId);
  if (!site) {
    return notFound();
  }
  return {
    title: site.name,
    // description: ,
  };
}

export default async function Page({ params }: { params: { site: string } }) {
  const { site: siteId } = await params;
  const site = getSite(siteId);
  if (!site) {
    return notFound();
  }
  return <SiteCard site={site} />;
}
