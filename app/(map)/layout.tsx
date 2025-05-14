"use client";

import { PropsWithChildren, useEffect, useMemo, useRef, useState } from "react";
import { Drawer } from "vaul";
import "mapbox-gl/dist/mapbox-gl.css";
import SITES from "@/lib/data/sites-mini.json" assert { type: "json" };
import Map, {
  GeolocateControl,
  MapProvider,
  MapRef,
  NavigationControl,
} from "react-map-gl/mapbox";
import DeckGL from "@deck.gl/react";
import type { MapViewState } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { useParams, useRouter } from "next/navigation";
import { SiteNPLStatus } from "@/lib/data/site";
import clsx from "clsx";

function MainCard({
  title,
  children,
  ...props
}: PropsWithChildren<{ title?: string }>) {
  return (
    <Drawer.Root dismissible={false} modal={false} open={true}>
      <Drawer.Portal>
        <Drawer.Content
          {...props}
          className={clsx(
            "main-card backdrop-blur-lg backdrop-saturate-150 rounded-t-xl md:rounded-2xl",
            "fixed max-h-[50svb] bottom-0 max-md:left-0 max-md:right-0",
            "md:absolute md:max-h-[90vh] md:top-8 md:left-8 md:bottom-auto",
            "z-10 outline-none !overflow-y-auto overflow-x-clip [scrollbar-width:thin] !touch-auto",
            "flex flex-col w-full md:max-w-xl p-4 md:p-6 @container",
            "text-sm font-mono leading-relaxed !select-auto",
          )}
          data-vaul-custom-container
        >
          {title && (
            <Drawer.Title className="text-balance font-bold font-sans text-3xl">
              {title}
            </Drawer.Title>
          )}
          {children}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

const initialViewState = {
  latitude: 39.8283,
  longitude: -98.5795,
  zoom: 4,
  bearing: 0,
  pitch: 20,
};

// Color mapping for NPL statuses (RGBA)
const statusColors: Record<SiteNPLStatus, [number, number, number, number]> = {
  proposed: [245, 158, 11, 255], // amber-500
  listed: [255, 73, 33, 255], // primary (#ff4921)
  cleaning: [217, 70, 239, 255], // fuchsia-500
  cleaned: [14, 165, 233, 255], // sky-500
  completed: [20, 184, 166, 180], // teal-500 with 70% opacity
};

export default function Layout({ children }: PropsWithChildren<object>) {
  const router = useRouter();
  // const pathname = usePathname();
  const { site: siteId, status: nplStatus } = useParams();

  const mapRef = useRef<MapRef | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    // @ts-expect-error global
    window.mapRef = mapRef;
  }, []);

  // Removed individual Marker components in favor of DeckGL ScatterplotLayer
  // Manage map view state for DeckGL
  const [viewState, setViewState] = useState<MapViewState>(initialViewState);

  // DeckGL layer for site points
  const layers = useMemo(() => {
    return [
      new ScatterplotLayer({
        id: "sites-layer",
        data: SITES,
        pickable: true,
        stroked: false,
        filled: true,
        radiusMinPixels: 10,
        radiusMaxPixels: 50,
        getPosition: (d: any) => [d.lng, d.lat],
        getFillColor: (d: any) =>
          statusColors[d.npl as SiteNPLStatus] || [0, 0, 0, 255],
        onClick: (info: any) => {
          if (info.object) {
            router.push(`/sites/${info.object.id}`);
          }
        },
        updateTriggers: {
          getFillColor: [nplStatus],
        },
      }),
    ];
  }, [router, nplStatus]);

  return (
    <div className="w-full h-full" ref={rootRef}>
      <MapProvider>
        <DeckGL
          initialViewState={initialViewState}
          controller={true}
          layers={layers}
          onViewStateChange={({ viewState }) =>
            setViewState(viewState as MapViewState)
          }
          style={{ position: "absolute", inset: "0" }}
        >
          <Map
            ref={mapRef}
            viewState={viewState}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
            style={{ width: "100%", height: "100%" }}
          >
            <GeolocateControl />
            <NavigationControl
              position="top-right"
              showCompass={false}
              visualizePitch={false}
            />
          </Map>
        </DeckGL>
        <MainCard>{children}</MainCard>
      </MapProvider>
    </div>
  );
}
