import { SiteList } from "@/app/(map)/sites/list";
import states from "@/lib/data/states.json" assert { type: "json" };
import { allSites } from "@/lib/data/api";
import { HeaderRoot, HeaderBreadcrumb, HeaderTitle } from "@/lib/ui/header";
import { MapZoom } from "../../zoom";
import { Count } from "@/lib/ui/count";
import { nplStatuses } from "@/lib/data/site";
import { Heading } from "@/lib/ui/typography";
import { supabase } from "@/lib/supabaseClient";

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

const sections = Object.keys(nplStatuses);
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
      {sections.map((section) => {
        const sectionSites = sites
          .filter((site) => site.npl === section)
          .sort((a, b) => {
            return a.name.localeCompare(b.name);
          });
        if (!sectionSites.length) return null;
        return (
          <section id={section} key={section}>
            <Heading>{nplStatuses[section].label}</Heading>
            <SiteList className="mb-4" sites={sectionSites} />
          </section>
        );
      })}
    </>
  );
}
