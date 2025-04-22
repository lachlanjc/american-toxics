"use client";
import { useEffect, useRef, useState } from "react";
import { MapZoom } from "../../zoom";
import { SupabaseSite } from "@/lib/data/site";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Link } from "next-view-transitions";
import { MiniSite } from "../../sites/[site]/mini";
import { SiteNPLStatusIcon } from "../../sites/list";
import { useSearchParams } from "next/navigation";
// @ts-expect-error js package
import { lockScrollbars } from "lock-scrollbars";
import clsx from "clsx";

// Reuse the type for items
export type ResultItem = {
  id: string;
  createdAt: string;
  addressCity: string;
  addressStateCode: string;
  nearestMiles: number;
  sites10Count: number;
  nearestSite: SupabaseSite;
};

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60 * 3) return `just now`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

export default function ResultsViewer({
  initialResults,
}: {
  initialResults: ResultItem[];
}) {
  const searchParams = useSearchParams();
  const newId = searchParams.get("id");
  const [selected, setSelected] = useState<ResultItem | null>(
    initialResults[0],
  );
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const newRecord = initialResults.find((r) => r.id === newId);
    if (newId && newRecord) {
      setSelected(newRecord);
      const unlockScrollbars = lockScrollbars();
      setTimeout(() => {
        document
          .getElementById(newId)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          unlockScrollbars();
        }, 2000);
      }, 2000);
    }
  }, [newId]);
  const furthestDistance = Math.max(
    ...initialResults.map((r) => r.nearestMiles),
  );
  const { lat, lng } = selected?.nearestSite ?? {
    lat: 39.8283,
    lng: -98.5795,
  };

  return (
    <div className="flex flex-col max-h-full overflow-y-hidden overflow-x-visible -m-4 md:-m-6">
      {lat && lng && <MapZoom center={[lat, lng]} />}
      <div className="p-4 md:p-6">
        <HeaderRoot
          showClose
          actions={
            <Link
              href="/scoreboard/new"
              className="action-button !bg-neutral-800 hover:!bg-neutral-700 text-neutral-100 cursor-pointer font-sans font-medium text-base py-1.5 px-3 shrink-0"
            >
              Find yours
            </Link>
          }
        >
          <HeaderTitle>Scoreboard: Distance to American Toxics</HeaderTitle>
        </HeaderRoot>
      </div>
      {selected?.nearestSite && (
        <div className="scroll-mt-6 p-4 md:p-6 !pt-0 -mt-4">
          <MiniSite site={selected.nearestSite} />
        </div>
      )}
      <ol
        className="flex-auto overflow-y-auto snap-y snap-mandatory border-t border-neutral-300"
        role="list"
        ref={list}
      >
        {initialResults.map((item, i) => (
          <li
            key={item.id}
            id={item.id}
            className={clsx(
              "flex gap-6 items-center",
              "py-4 pl-4 pr-6 md:pl-6",
              "border-b last:border-b-0 border-neutral-300",
              "snap-start overflow-x-hidden cursor-pointer",
              newId && item.id === newId
                ? "bg-primary shine-effect"
                : "hover:bg-white/30 aria-selected:bg-white transition-colors",
            )}
            aria-selected={item.id === selected?.id}
            onClick={() => {
              setSelected(item);
            }}
            style={{
              backgroundImage: `linear-gradient(${[
                "to right",
                "hsl(0 0 0 / 5%) 0%",
                `hsl(0 0 0 / 5%) ${(item.nearestMiles * 100) / furthestDistance}%`,
                `transparent ${(item.nearestMiles * 100) / furthestDistance}%`,
                "transparent 100%",
              ].join(", ")})`,
            }}
          >
            <span
              className="text-7xl text-neutral-900/20 font-sans leading-none tracking-[-8px] text-trim-both md:-ml-1"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="flex-auto max-w-full">
              <div className="text-3xl font-sans font-bold mb-2">
                {item.nearestMiles.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                mi
              </div>
              <div className="text-xs text-neutral-600 flex items-last-baseline justify-between gap-3 max-w-full">
                <span className="truncate flex-auto min-w-0 max-w-full">
                  {item.addressStateCode}
                  {item.nearestSite?.npl && (
                    <SiteNPLStatusIcon
                      status={item.nearestSite?.npl}
                      className="ml-3 mr-1.5"
                    />
                  )}
                  {item.nearestSite?.name?.split(" (")[0]}
                </span>
                <time
                  dateTime={item.createdAt}
                  className="text-right text-nowrap"
                >
                  {relativeTime(item.createdAt)}
                </time>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
