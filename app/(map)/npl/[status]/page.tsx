import { SiteList } from "@/app/(map)/sites/list";
import STATES from "@/lib/data/states.json" assert { type: "json" };
import { allSites } from "@/lib/data/api";
import {
  HeaderRoot,
  HeaderBreadcrumb,
  HeaderTitle,
  HeaderSubtitle,
} from "@/lib/ui/header";
// import { MapZoom } from "../../zoom";
import { nplStatuses } from "@/lib/data/site";
import { notFound } from "next/navigation";
import { Count } from "@/lib/ui/count";
import { Heading } from "@/lib/ui/typography";

export async function generateStaticParams() {
  return Object.keys(nplStatuses).map((status) => ({ status }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status: statusKey } = await params;
  const status = nplStatuses[statusKey];
  if (!status) {
    throw new Error(`Status not found: ${statusKey}`);
  }

  return {
    title: `${status.label} Superfund Sites`,
    description: `List of contaminated toxic waste Superfund sites in the ${status.label.toLowerCase()} phase.`,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ status: string }>;
}) {
  const { status: statusKey } = await params;
  const status = nplStatuses[statusKey];
  if (!status) {
    return notFound();
  }
  const sites = allSites.filter((site) => site.npl === statusKey);

  return (
    <>
      {/* <MapZoom center={[state.lat, state.lng]} zoom={state.zoom + 2} /> */}
      <HeaderRoot>
        <HeaderBreadcrumb href="/npl">
          Superfund Sites by Cleanup Phase
        </HeaderBreadcrumb>
        <HeaderTitle style={{ viewTransitionName: statusKey }}>
          {status.label} <Count value={sites.length} />
        </HeaderTitle>
        <HeaderSubtitle>{status.desc}</HeaderSubtitle>
      </HeaderRoot>
      {STATES.map((state) => {
        const sectionSites = sites
          .filter((site) => site.stateCode === state.abbrev)
          .sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        if (!sectionSites.length) return null;
        return (
          <section id={state.abbrev} key={state.abbrev}>
            <Heading>{state.name}</Heading>
            <SiteList className="mb-4 -mt-2" sites={sectionSites} />
          </section>
        );
      })}
    </>
  );
}
