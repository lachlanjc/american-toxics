import { SearchableSections } from "@/app/(map)/sites/search-sections";
import { nplStatuses } from "@/lib/data/site";
import states from "@/lib/data/states.json" with { type: "json" };
import { supabase } from "@/lib/supabaseClient";
import { Count } from "@/lib/ui/count";
import { HeaderBreadcrumb, HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { MapZoom } from "../../zoom";

export async function generateStaticParams() {
  return states.map(({ abbrev }) => ({ abbrev }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ abbrev: string }>;
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

export default async function Page({
  params,
}: {
  params: Promise<{ abbrev: string }>;
}) {
  const { abbrev } = await params;
  const state = states.find(
    (state) => state.abbrev.toLowerCase() === abbrev.toLowerCase(),
  );
  if (!state) {
    throw new Error(`State not found: ${abbrev}`);
  }
  const { data: sites, error } = await supabase
    .from("sites")
    .select("id, name, category, npl, city, stateCode")
    .eq("stateCode", state.abbrev)
    .order("name", { ascending: true });
  if (!sites || error) {
    console.error(error);
    throw new Error(`Sites not found for state: ${abbrev}`);
  }
  // Prepare sections grouped by NPL status
  const sections = Object.keys(nplStatuses)
    .map((statusKey) => {
      const sectionSites = sites
        .filter((site) => site.npl === statusKey)
        .sort((a, b) => a.name.localeCompare(b.name));
      return {
        key: statusKey,
        label: nplStatuses[statusKey].label,
        sites: sectionSites,
      };
    })
    .filter((section) => section.sites.length > 0);

  return (
    <>
      <MapZoom center={[state.lat, state.lng]} zoom={state.zoom + 2} />
      <HeaderRoot>
        <HeaderBreadcrumb href="/states">
          Superfund Sites by State
        </HeaderBreadcrumb>
        <HeaderTitle style={{ viewTransitionName: state.abbrev }}>
          {state.name} <Count value={sites.length} />
        </HeaderTitle>
      </HeaderRoot>
      <SearchableSections sections={sections} />
    </>
  );
}
