import Link from "next/link";
import type { SupabaseSite } from "@/lib/data/site";
import SvgChevronDown from "@/lib/icons/ChevronDown";
import SvgTrophy from "@/lib/icons/Trophy";
import { supabase } from "@/lib/supabaseClient";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import type { Database } from "@/supabase/types";
import { MiniSite } from "../../sites/[site]/mini";
import { SiteList } from "../../sites/list";
import { MapZoom } from "../../zoom";
import { ShareButton } from "./share";

export const dynamic = "auto";

type SupabaseScore = Database["public"]["Tables"]["scores"]["Row"];
type PartialSite = Pick<
  SupabaseSite,
  "id" | "name" | "city" | "stateCode" | "category" | "npl" | "lat" | "lng"
>;

const pluralize = (count: number) => `${count} Site${count === 1 ? "" : "s"}`;

type CollapsibleSiteListProps = {
  title: string;
  siteIds: string[];
  siteMap: Map<string, PartialSite>;
};

function CollapsibleSiteList({
  title,
  siteIds,
  siteMap,
}: CollapsibleSiteListProps) {
  const sites = siteIds
    .map((sid: string) => siteMap.get(sid))
    .filter(Boolean) as Array<PartialSite>;

  return (
    <details className="mt-6" open={sites.length <= 2}>
      <summary className="flex cursor-pointer items-center gap-2 overflow-clip">
        <div className="font-sans font-semibold text-lg">
          {pluralize(siteIds.length)} {title}
        </div>
        <SvgChevronDown
          aria-hidden
          className="-mr-1 ml-auto in-open:rotate-180 text-neutral-400 transition-transform"
          height={20}
          width={20}
        />
      </summary>
      <SiteList sites={sites} />
    </details>
  );
}

export default async function ScorePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { data: score, error: scoreError } = await supabase
    .from("scores")
    .select("*")
    .eq("id", id)
    .single();
  const siteNearestId = score.siteNearest;
  if (scoreError || !score || !siteNearestId) {
    return <p>Score not found.</p>;
  }
  const { lat, lng, addressFormatted, siteNearestMiles } =
    score as SupabaseScore;
  let { sites1, sites5, sites10, sites20 } = score as SupabaseScore;
  sites1 ??= [];
  sites5 ??= [];
  sites10 ??= [];
  sites20 ??= [];

  const allIds = Array.from(
    new Set([siteNearestId, ...sites1, ...sites5, ...sites10, ...sites20])
  );
  const { data: siteRecords } = await supabase
    .from("sites")
    .select("id,name,lat,lng,category,npl,city,stateCode")
    .in("id", allIds);
  const siteMap = new Map(
    (siteRecords || []).map((s: PartialSite) => [s.id, s])
  );
  const siteNearest = siteMap.get(siteNearestId);

  const buckets = [
    { title: "Within 2 Miles", ids: sites1 },
    { title: "Within 5 Miles", ids: sites5 },
    { title: "Within 10 Miles", ids: sites10 },
    { title: "Within 20 Miles", ids: sites20 },
  ];

  return (
    <>
      {lat && lng && <MapZoom center={[lat, lng]} />}
      <HeaderRoot closeLink="/scoreboard/new" showClose>
        <HeaderTitle>
          That’s{" "}
          {siteNearestMiles?.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}{" "}
          mi from the nearest toxic site.
        </HeaderTitle>
        <HeaderSubtitle>
          {addressFormatted?.replace(", United States of America", "")}
          {/*
            <Link
              href={`/states/${addressStateCode ?? ""}`}
              className="underline underline-offset-3 hover:text-primary transition-colors"
            >
              <abbr title={siteNearest.stateCode} className="no-underline">
                {addressStateCode}
              </abbr>
            </Link>
          */}
        </HeaderSubtitle>
      </HeaderRoot>
      {siteNearest?.lat && siteNearest?.lng && (
        <MapZoom center={[siteNearest.lat, siteNearest.lng]} />
      )}
      {siteNearest && <MiniSite site={siteNearest} />}
      {buckets.map(({ title, ids }) => (
        <CollapsibleSiteList
          key={title}
          siteIds={ids}
          siteMap={siteMap}
          title={title}
        />
      ))}

      <div className="mt-6 grid grid-cols-2 gap-4">
        <ShareButton url={`/scoreboard/${id}`} />
        <Link
          className="action-button !bg-neutral-800 hover:!bg-neutral-700 flex cursor-pointer items-center justify-center gap-2 py-1.5 font-medium font-sans text-base text-neutral-100"
          href={`/scoreboard/results?id=${id}`}
        >
          <SvgTrophy className="text-neutral-300" height={24} width={24} />
          See Your Ranking
        </Link>
        {/*
          <Link
            href="/scoreboard/new"
            className="action-button !bg-neutral-800 hover:!bg-neutral-700 text-neutral-100 cursor-pointer font-sans font-medium text-base py-1.5 gap-2 flex items-center justify-center"
          >
            <SvgRestart width={24} height={24} className="text-neutral-300" />
            Restart
          </Link>
          */}
      </div>
    </>
  );
}
