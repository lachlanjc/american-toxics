"use client";

import {
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Drawer } from "vaul";
import "mapbox-gl/dist/mapbox-gl.css";
import clsx from "clsx";
import type { FeatureCollection, Point } from "geojson";
import { useParams, useRouter } from "next/navigation";
import Map, {
  GeolocateControl,
  Layer,
  type LayerProps,
  type MapMouseEvent,
  MapProvider,
  type MapRef,
  NavigationControl,
  Source,
} from "react-map-gl/mapbox";
import type { SiteNPLStatus } from "@/lib/data/site";
import SITES from "@/lib/data/sites-mini.json" with { type: "json" };

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

const statusFillColors: Record<SiteNPLStatus, string> = {
  proposed: "#f59e0b",
  listed: "#ff4921",
  cleaning: "#c026d3",
  cleaned: "#0ea5e9",
  completed: "#14b8a6",
};

const siteLayerId = "site-points";

const siteCircleLayer: LayerProps = {
  id: siteLayerId,
  type: "circle",
  source: "sites",
  paint: {
    "circle-color": ["get", "color"],
    "circle-opacity": ["case", ["get", "dimmed"], 0.2, 0.9],
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      3,
      ["case", ["get", "selected"], 7.5, 4.5],
      10,
      ["case", ["get", "selected"], 18, 11],
    ],
  },
};

export default function Layout({ children }: PropsWithChildren<object>) {
  const router = useRouter();
  // const pathname = usePathname();
  const { site: siteId, status: nplStatus } = useParams();

  const mapRef = useRef<MapRef | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  useEffect(() => {
    // @ts-expect-error global
    window.mapRef = mapRef;
  }, []);

  const activeSiteId = useMemo(() => {
    if (Array.isArray(siteId)) {
      return siteId[0];
    }
    return siteId ?? null;
  }, [siteId]);

  const activeNplStatus = useMemo(() => {
    if (Array.isArray(nplStatus)) {
      return nplStatus[0] as SiteNPLStatus;
    }
    return (nplStatus as SiteNPLStatus | undefined) ?? undefined;
  }, [nplStatus]);

  const siteGeojson = useMemo<
    FeatureCollection<Point, Record<string, unknown>>
  >(() => {
    return {
      type: "FeatureCollection",
      features: SITES.map((marker) => ({
        type: "Feature",
        id: marker.id,
        geometry: {
          type: "Point",
          coordinates: [marker.lng, marker.lat],
        },
        properties: {
          id: marker.id,
          // npl: marker.npl,
          color:
            statusFillColors[marker.npl as SiteNPLStatus] ??
            statusFillColors.listed,
          dimmed: Boolean(activeNplStatus && activeNplStatus !== marker.npl),
          selected: Boolean(activeSiteId && activeSiteId === marker.id),
        },
      })),
    } satisfies FeatureCollection<Point, Record<string, unknown>>;
  }, [activeNplStatus, activeSiteId]);

  const handleMapClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    const featureId = feature?.properties?.id;
    if (featureId && typeof featureId === "string") {
      router.push(`/sites/${featureId}`);
    }
  };

  const handleMouseMove = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    setCursor(feature ? "pointer" : undefined);
  };

  return (
    <div className="w-full h-full" ref={rootRef}>
      <MapProvider>
        <style>{`.mapboxgl-canvas, .mapboxgl-marker { position: absolute !important; }`}</style>
        <Map
          ref={mapRef}
          initialViewState={initialViewState}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            inset: 0,
          }}
          interactiveLayerIds={[siteLayerId]}
          onClick={handleMapClick}
          onMouseMove={handleMouseMove}
          cursor={cursor}
        >
          <GeolocateControl />
          <NavigationControl
            position="top-right"
            showCompass={false}
            visualizePitch={false}
          />
          <Source id="sites" type="geojson" data={siteGeojson}>
            <Layer {...siteCircleLayer} />
          </Source>
        </Map>
        <MainCard>{children}</MainCard>
      </MapProvider>
    </div>
  );
}
