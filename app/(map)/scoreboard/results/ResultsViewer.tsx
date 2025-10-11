"use client";
import clsx from "clsx";
// @ts-expect-error js package
import { lockScrollbars } from "lock-scrollbars";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ListBox, ListBoxItem } from "react-aria-components";
import type { SupabaseSite } from "@/lib/data/site";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { MiniSite } from "../../sites/[site]/mini";
import { SiteNPLStatusIcon } from "../../sites/list";
import { MapZoom } from "../../zoom";

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
  if (seconds < 60 * 3) return "just now";
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
    initialResults[0]
  );

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
  }, [newId, initialResults]);
  const furthestDistance = Math.max(
    ...initialResults.map((r) => r.nearestMiles)
  );
  const { lat, lng } = selected?.nearestSite ?? {
    lat: 39.8283,
    lng: -98.5795,
  };

  return (
    <div className="-m-4 md:-m-6 flex max-h-full flex-col overflow-y-hidden overflow-x-visible">
      {lat && lng && <MapZoom center={[lat, lng]} />}
      <div className="p-4 md:p-6">
        <HeaderRoot
          actions={
            <Link
              className="action-button shrink-0 cursor-pointer px-3 py-1.5 font-medium font-sans text-base"
              href="/"
            >
              Find yours
            </Link>
          }
        >
          <HeaderTitle>Scoreboard: Distance to American Toxics</HeaderTitle>
        </HeaderRoot>
      </div>
      {selected?.nearestSite && (
        <div className="!pt-0 -mt-4 scroll-mt-6 p-4 md:p-6">
          <MiniSite site={selected.nearestSite} />
        </div>
      )}
      <ListBox
        aria-label="Scoreboard results"
        className="flex-auto snap-y snap-mandatory overflow-y-auto border-neutral-300 border-t"
        disallowEmptySelection
        onSelectionChange={(key) => {
          const id = typeof key === "string" ? key : Array.from(key)[0];
          const item = initialResults.find((r) => r.id === id);
          if (item) setSelected(item);
        }}
        selectedKeys={selected ? new Set([selected.id]) : new Set()}
        selectionMode="single"
      >
        {initialResults.map((item, i) => (
          <ListBoxItem
            className={clsx(
              "flex items-center gap-6",
              "py-4 pr-6 pl-4 md:pl-6",
              "-outline-offset-2 border-neutral-300 border-b last:border-b-0",
              "cursor-pointer snap-start overflow-x-hidden",
              item.id === newId
                ? "shine-effect bg-primary"
                : "transition-colors hover:bg-white/30 data-[selected]:bg-white"
            )}
            id={item.id}
            key={item.id}
            style={{
              backgroundImage: `linear-gradient(${[
                "to right",
                "hsl(0 0 0 / 5%) 0%",
                `hsl(0 0 0 / 5%) ${(item.nearestMiles * 100) / furthestDistance}%`,
                `transparent ${(item.nearestMiles * 100) / furthestDistance}%`,
                "transparent 100%",
              ].join(", ")})`,
            }}
            textValue={`${item.addressStateCode} ${item.nearestSite?.name}`}
          >
            <span
              aria-hidden
              className="md:-ml-1 font-sans text-7xl text-neutral-900/20 text-trim-both leading-none tracking-[-8px]"
            >
              {i + 1}
            </span>
            <div className="max-w-full flex-auto">
              <div className="mb-2 font-bold font-sans text-3xl">
                {item.nearestMiles.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                mi
              </div>
              <div className="items-last-baseline flex max-w-full justify-between gap-3 text-neutral-600 text-xs">
                <span className="min-w-0 max-w-full flex-auto truncate">
                  {item.addressStateCode}
                  {item.nearestSite?.npl && (
                    <SiteNPLStatusIcon
                      className="mr-1.5 ml-3"
                      status={item.nearestSite?.npl}
                    />
                  )}
                  {item.nearestSite?.name?.split(" (")[0]}
                </span>
                <time
                  className="text-nowrap text-right"
                  dateTime={item.createdAt}
                >
                  {relativeTime(item.createdAt)}
                </time>
              </div>
            </div>
          </ListBoxItem>
        ))}
      </ListBox>
    </div>
  );
}
