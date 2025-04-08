import { SiteList } from "@/app/(map)/sites/list";
import states from "@/lib/data/states.json" assert { type: "json" };
import { allSites } from "@/lib/data/api";
import { HeaderRoot, HeaderBreadcrumb, HeaderTitle } from "@/lib/ui/header";
import { MapZoom } from "../../zoom";

export async function generateStaticParams() {
  return states.map(({ abbrev }) => ({ abbrev }));
}

export async function generateMetadata({
  params,
}: {
  params: { abbrev: string };
}) {
  const { abbrev } = await params;
  const state = states.find(
    (state) => state.abbrev.toLowerCase() === abbrev.toLowerCase(),
  );
  if (!state) {
    throw new Error(`State not found: ${abbrev}`);
  }

  return {
    title: `Superfund Sites in ${state.name}`,
    description: `List of contaminated toxic waste Superfund sites in ${state.name} (${abbrev}).`,
  };
}

export default async function Page({ params }: { params: { abbrev: string } }) {
  const { abbrev } = await params;
  const state = states.find(
    (state) => state.abbrev.toLowerCase() === abbrev.toLowerCase(),
  );
  if (!state) {
    throw new Error(`State not found: ${abbrev}`);
  }
  const sites = allSites
    .filter((site) => site.stateCode === state.abbrev)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <MapZoom center={[state.lat, state.lng]} zoom={state.zoom + 2} />
      <HeaderRoot>
        <HeaderBreadcrumb href="/states">
          Superfund Sites by State
        </HeaderBreadcrumb>
        <HeaderTitle style={{ viewTransitionName: state.abbrev }}>
          {state.name}
        </HeaderTitle>
      </HeaderRoot>
      <SiteList sites={sites} className="-mt-2" />
    </>
  );
}
