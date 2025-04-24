import STATES from "@/lib/data/states.json" assert { type: "json" };
import { supabase } from "@/lib/supabaseClient";
import {
  HeaderRoot,
  HeaderBreadcrumb,
  HeaderTitle,
  HeaderSubtitle,
} from "@/lib/ui/header";
// import { MapZoom } from "../../zoom";
import { nplStatuses } from "@/lib/data/site";
import { notFound } from "next/navigation";
import { SearchableSections } from "@/app/(map)/sites/search-sections";
import { Count } from "@/lib/ui/count";

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
    title: `${status.label} Toxic Superfund Sites`,
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
  const { data: sites, error } = await supabase
    .from("sites")
    .select("id, name, category, npl, city, stateCode")
    .eq("npl", statusKey);
  if (error) {
    console.error("Error fetching sites for NPL status:", error);
  }
  // Prepare sections grouped by state
  const sections = STATES.map((state) => {
    const sectionSites = (sites || [])
      .filter((site) => site.stateCode === state.abbrev)
      .sort((a, b) => a.name.localeCompare(b.name));
    return { key: state.abbrev, label: state.name, sites: sectionSites };
  }).filter((section) => section.sites.length > 0);

  return (
    <>
      <HeaderRoot>
        <HeaderBreadcrumb href="/npl">
          Superfund Sites by Cleanup Phase
        </HeaderBreadcrumb>
        <HeaderTitle style={{ viewTransitionName: statusKey }}>
          {status.label} <Count value={sites!.length} />
        </HeaderTitle>
        <HeaderSubtitle>{status.desc}</HeaderSubtitle>
      </HeaderRoot>
      <SearchableSections sections={sections} />
    </>
  );
}
