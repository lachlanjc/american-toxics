import React from "react";
import { supabase } from "@/lib/supabaseClient";
import { MapZoom } from "../../zoom";
import { SiteList } from "../../sites/list";
import { HeaderRoot, HeaderTitle, HeaderSubtitle } from "@/lib/ui/header";
import Link from "next/link";
import SvgChevronDown from "@/lib/icons/ChevronDown";
import { Database } from "@/supabase/types";
import { WellRoot, WellTitle } from "@/lib/ui/well";
import { CategoryChip } from "../../sites/[site]/category";
import { StatusChip } from "../../sites/[site]/status";
import { ShareButton } from "./share";
import SvgTrophy from "@/lib/icons/Trophy";
import { SupabaseSite } from "@/lib/data/site";
import { MiniSite } from "../../sites/[site]/mini";

type PartialSite = Pick<
  SupabaseSite,
  "id" | "name" | "city" | "stateCode" | "category" | "npl" | "lat" | "lng"
>;
export default async function ScorePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: score, error: scoreError } = await supabase
    .from("scores")
    .select("*")
    .eq("id", id)
    .single();
  const siteNearestId = score.siteNearest;
  if (scoreError || !score || !siteNearestId) {
    return <p>Score not found.</p>;
  }
  let {
    lat,
    lng,
    addressFormatted,
    siteNearestMiles,
    sites1,
    sites5,
    sites10,
    sites20,
  } = score as Database["public"]["Tables"]["scores"]["Row"];
  sites1 ??= [];
  sites5 ??= [];
  sites10 ??= [];
  sites20 ??= [];

  const allIds = Array.from(
    new Set([siteNearestId, ...sites1, ...sites5, ...sites10, ...sites20]),
  );
  const { data: siteRecords } = await supabase
    .from("sites")
    .select("id,name,city,stateCode,category,npl,lat,lng")
    .in("id", allIds);
  const siteMap = new Map(
    (siteRecords || []).map((s: PartialSite) => [s.id, s]),
  );
  const siteNearest = siteMap.get(siteNearestId);

  const pluralize = (count: number) => `${count} site${count === 1 ? "" : "s"}`;
  const buckets = [
    { title: "within 2 miles", ids: sites1 },
    { title: "within 5 miles", ids: sites5 },
    { title: "within 10 miles", ids: sites10 },
    { title: "within 20 miles", ids: sites20 },
  ];

  return (
    <>
      {lat && lng && <MapZoom center={[lat, lng]} />}
      <HeaderRoot showClose closeLink="/scoreboard/new">
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
        <details key={title} className="mt-6">
          <summary className="flex gap-2 items-center cursor-pointer overflow-clip">
            <div className="text-lg font-sans font-semibold">
              {pluralize(ids.length)} {title}
            </div>
            <SvgChevronDown
              width={20}
              height={20}
              className="-mr-1 ml-auto text-neutral-400 transition-transform in-open:rotate-180"
              aria-hidden
            />
          </summary>
          <SiteList
            sites={
              ids
                .map((sid: string) => siteMap.get(sid))
                .filter(Boolean) as Array<PartialSite>
            }
          />
        </details>
      ))}

      <div className="grid grid-cols-2 gap-4 mt-6">
        <ShareButton url={`/scoreboard/${id}`} />
        <Link
          href={`/scoreboard/results?id=${id}`}
          className="action-button !bg-neutral-800 hover:!bg-neutral-700 text-neutral-100 cursor-pointer font-sans font-medium text-base py-1.5 gap-2 flex items-center justify-center"
        >
          <SvgTrophy width={24} height={24} className="text-neutral-300" />
          See your ranking
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
