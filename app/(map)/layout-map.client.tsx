"use client";

import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Drawer } from "vaul";
import "mapbox-gl/dist/mapbox-gl.css";
import clsx from "clsx";
import { useParams, useRouter } from "next/navigation";
import MapComponent, {
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

const statusFillColors: Record<SiteNPLStatus, string> = {
  proposed: "#fe9a00",
  listed: "#ff4921",
  cleaning: "#e12afb",
  cleaned: "#00a6f4",
  verified: "#00bba7",
};

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
            "main-card rounded-t-xl backdrop-blur-lg backdrop-saturate-150 md:rounded-2xl",
            "fixed bottom-0 max-h-[50svb] max-md:right-0 max-md:left-0",
            "md:absolute md:top-8 md:bottom-auto md:left-8 md:max-h-[90vh]",
            "!overflow-y-auto !touch-auto z-10 overflow-x-clip outline-none [scrollbar-width:thin]",
            "@container flex w-full flex-col p-4 md:max-w-xl md:p-6",
            "!select-auto font-mono text-sm leading-relaxed"
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

const siteLayerId = "site-points";

export default function MapLayoutClient({
  children,
}: PropsWithChildren<object>) {
  const router = useRouter();
  const { site: siteId, status: nplStatus } = useParams();

  const mapRef = useRef<MapRef | null>(null);
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

  const siteCircleLayer = useMemo<LayerProps>(() => {
    const selectedId = activeSiteId ?? "";
    const opacity = activeNplStatus
      ? (["case", ["!=", ["get", "npl"], activeNplStatus], 0.2, 0.9] as const)
      : 0.9;

    const colorExpression: NonNullable<LayerProps["paint"]>["circle-color"] = [
      "match",
      ["get", "npl"],
      "proposed",
      statusFillColors.proposed,
      "listed",
      statusFillColors.listed,
      "cleaning",
      statusFillColors.cleaning,
      "cleaned",
      statusFillColors.cleaned,
      "verified",
      statusFillColors.verified,
      statusFillColors.listed,
    ];

    return {
      id: siteLayerId,
      type: "circle",
      source: "sites",
      paint: {
        "circle-color": colorExpression,
        "circle-opacity": opacity,
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["zoom"],
          3,
          ["case", ["==", ["id"], selectedId], 7.5, 4.5],
          10,
          ["case", ["==", ["id"], selectedId], 18, 11],
        ],
      },
    } satisfies LayerProps;
  }, [activeNplStatus, activeSiteId]);

  const handleMapClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    const featureId = feature?.id;
    if (featureId != null) {
      router.push(`/sites/${String(featureId)}`);
    }
  };

  const handleMouseMove = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    setCursor(feature ? "pointer" : undefined);
  };

  return (
    <div className="h-full w-full">
      <MapProvider>
        <style>
          {
            ".mapboxgl-canvas, .mapboxgl-marker { position: absolute !important; }"
          }
        </style>
        <MapComponent
          cursor={cursor}
          initialViewState={initialViewState}
          interactiveLayerIds={[siteLayerId]}
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
          onClick={handleMapClick}
          onMouseMove={handleMouseMove}
          ref={mapRef}
          style={{
            width: "100%",
            height: "100vh",
            position: "absolute",
            inset: 0,
          }}
        >
          <GeolocateControl />
          <NavigationControl
            position="top-right"
            showCompass={false}
            visualizePitch={false}
          />
          <Source data="/sites.geojson" id="sites" type="geojson">
            <Layer {...siteCircleLayer} />
          </Source>
        </MapComponent>
        <MainCard>{children}</MainCard>
      </MapProvider>
    </div>
  );
}
