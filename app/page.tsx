"use client";

import {
  PropsWithChildren,
  startTransition,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { SiteCard } from "@/app/sites/[site]/site";
import SITES from "@/lib/data/sites.json" assert { type: "json" };
import { hasPlainSiteImage, Site } from "@/lib/data/site";

import "mapbox-gl/dist/mapbox-gl.css";

import Map, { MapRef, Marker } from "react-map-gl/mapbox";
import { useFuse } from "@/lib/util/use-fuse";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGFja2NsdWIiLCJhIjoiY2pscGI1eGdhMGRyNzN3bnZvbGY5NDBvZSJ9.Zm4Zduj94TrgU8h890M7gA";

function MainCard(props: PropsWithChildren<{}>) {
  return (
    <main
      {...props}
      className="main-card backdrop-blur-lg backdrop-saturate-150 flex flex-col w-full max-w-xl p-6 mx-auto stretch font-mono overflow-y-auto max-h-[80vh]"
    />
  );
}

const initialViewState = {
  latitude: SITES[0].lat,
  longitude: SITES[1].lng,
  zoom: 4,
  bearing: 0,
  pitch: 20,
};

const searchOptions = {
  keys: ["name", "state", "city", "county"],
};

function Search({ onSelect }: { onSelect: (site: Site) => void }) {
  const { results, handleSearch, query, isPending } = useFuse({
    data: SITES,
    options: searchOptions,
  });

  return (
    <search>
      <input
        type="search"
        className="w-full action-button p-2 mb-4"
        value={query}
        placeholder="Search sites"
        onChange={handleSearch}
      />
      {results.length > 0 && (
        <ul className={`${isPending ? "opacity-50" : ""} transition-opacity`}>
          {results.map((result) => (
            <li key={result.id}>
              <button
                className="border-b border-zinc-300 last:border-b-0 text-xs py-2 text-left hover:opacity-80 transition-opacity cursor-pointer"
                onClick={() => onSelect(result)}
              >
                {result.name}
                <small className="text-zinc-500 block mt-1">
                  {result.city}, {result.state}
                </small>
              </button>
            </li>
          ))}
        </ul>
      )}
    </search>
  );
}

export default function Page() {
  const mapRef = useRef<MapRef | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeSite, setActiveSite] = useState<Site | null>(null);

  useEffect(() => {
    if (!activeSite) return;
    mapRef.current?.flyTo({
      center: [activeSite.lng, activeSite.lat],
      zoom: 14,
      duration: 2000,
    });
  }, [activeSite?.id]);

  return (
    <div className="w-full h-full" ref={rootRef}>
      <style>{`.mapboxgl-canvas, .mapboxgl-marker { position: absolute !important; }`}</style>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          inset: 0,
        }}
        cooperativeGestures
      >
        {SITES.sort((a, b) => b.lat - a.lat).map((marker, i) => (
          <Marker
            anchor="bottom"
            longitude={marker.lng}
            latitude={marker.lat}
            onClick={() => {
              setActiveSite(marker);
            }}
            key={marker.id}
            style={{ position: "relative" }}
          >
            <svg
              className={
                activeSite?.id === marker.id
                  ? "fill-primary-light"
                  : "fill-primary"
              }
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
              width={32}
              height={32}
              viewBox="0 0 24 24"
            >
              <title>{marker.name}</title>
              <path
                d={`M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3 c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9 C20.1,15.8,20.2,15.8,20.2,15.7z`}
              />
            </svg>
          </Marker>
        ))}
      </Map>
      <MainCard>
        {activeSite ? (
          <>
            <button
              className="absolute top-6 right-6 rounded-full bg-black/10 w-8 h-8 text-center"
              onClick={() => {
                setActiveSite(null);
                mapRef.current?.flyTo({
                  zoom: Math.max(mapRef.current?.getZoom() - 2, 0),
                  duration: 1000,
                });
              }}
            >
              &times;
            </button>
            <SiteCard site={activeSite} />
          </>
        ) : (
          <>
            <h1 className="text-balance font-bold font-sans text-3xl mb-8">
              Superfund sites
            </h1>
            <Search onSelect={setActiveSite} />
          </>
        )}
      </MainCard>
      {activeSite && hasPlainSiteImage(activeSite.id) && (
        <img
          src={`/plainsite/${activeSite.id}.`}
          width={1097 / 3}
          height={1080 / 3}
          alt={activeSite.name}
          className="floating-image"
        />
      )}
    </div>
  );
}
