import { SiteList } from "@/app/(map)/sites/list";
import { allSites } from "@/lib/data/api";
import { HeaderRoot, HeaderBreadcrumb, HeaderTitle } from "@/lib/ui/header";
// import { MapZoom } from "../../zoom";
import { nplStatuses } from "@/lib/data/site";
import { notFound } from "next/navigation";

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
  const statusIndex = Object.keys(nplStatuses).indexOf(statusKey);
  const fieldsEmpty = Object.values(nplStatuses)
    .slice(statusIndex + 1)
    .map((obj) => obj.field);
  const sites = allSites.filter((site) =>
    fieldsEmpty.every((field) => site[field].toString().length === 0),
  );
  // .sort((a, b) => a.stateCode.localeCompare(b.stateCode));

  return (
    <>
      {/* <MapZoom center={[state.lat, state.lng]} zoom={state.zoom + 2} /> */}
      <HeaderRoot>
        <HeaderBreadcrumb href="/npl">
          Superfund Sites by Cleanup Phase
        </HeaderBreadcrumb>
        <HeaderTitle style={{ viewTransitionName: statusKey }}>
          {status.label} ({sites.length})
        </HeaderTitle>
      </HeaderRoot>
      <SiteList sites={sites} className="-mt-2" />
    </>
  );
}
