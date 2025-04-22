"use client";
import { useState } from "react";
import { MapZoom } from "../../zoom";
import { SupabaseSite } from "@/lib/data/site";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import Link from "next/link";

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
  if (seconds < 60) return `${seconds} sec${seconds === 1 ? "" : "s"} ago`;
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
  // Initialize center at first result's nearest site
  const first = initialResults[0];
  const [center, setCenter] = useState<[number, number]>(
    first ? [first.nearestSite.lat ?? 0, first.nearestSite.lng ?? 0] : [0, 0],
  );
  const furthestDistance = Math.max(
    ...initialResults.map((r) => r.nearestMiles),
  );

  return (
    <div className="flex flex-col">
      <MapZoom center={center} />
      <HeaderRoot
        actions={
          <Link
            href="/scoreboard/new"
            className="action-button font-sans font-bold text-center !bg-primary text-white ml-auto shrink-0 px-4 py-2 text-lg transition-opacity hover:opacity-90 self-start"
          >
            Restart
          </Link>
        }
      >
        <HeaderTitle>
          Scoreboard: Living next to American&nbsp;Toxics
        </HeaderTitle>
      </HeaderRoot>
      <ol className="" role="list">
        {initialResults.map((item, i) => (
          <li
            key={item.id}
            className="flex gap-6 items-center border-t border-t-neutral-300 cursor-pointer hover:bg-white/30 transition-colors py-4 -mx-6 px-6"
            onClick={() => {
              const lat = item.nearestSite.lat ?? 0;
              const lng = item.nearestSite.lng ?? 0;
              setCenter([lat, lng]);
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
              className="text-7xl text-neutral-900/20 font-sans leading-none tracking-tightest tabular-nums text-trim-both"
              aria-hidden
            >
              {i + 1}
            </span>
            <div className="flex-auto">
              <div className="text-3xl font-sans font-bold">
                {item.nearestMiles.toLocaleString("en-US", {
                  maximumFractionDigits: 2,
                })}{" "}
                mi
              </div>
              <div className="text-sm text-neutral-600 flex items-last-baseline justify-between">
                <span>
                  {item.addressCity}, {item.addressStateCode}
                </span>

                <time dateTime={item.createdAt} className="text-right">
                  {relativeTime(item.createdAt)}
                </time>
                {/* <Count value={item.sites10Count} />
              within 10 mi */}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
