"use client";

import { Drawer } from "@base-ui/react/drawer";
import type { ExpressionSpecification } from "mapbox-gl";
import type { PropsWithChildren } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import clsx from "clsx";
import { useParams, usePathname, useRouter } from "next/navigation";
import MapComponent, { GeolocateControl, Layer, MapProvider, NavigationControl, Source } from 'react-map-gl/mapbox';
import type { LayerProps, MapMouseEvent, MapRef } from 'react-map-gl/mapbox';
import { nplStatusHexColors } from '@/lib/data/site';
import type { SiteNPLStatus } from '@/lib/data/site';

const circleColorExpression: ExpressionSpecification = [
  "match",
  ["get", "npl"],
  "proposed",
  nplStatusHexColors.proposed,
  "listed",
  nplStatusHexColors.listed,
  "cleaning",
  nplStatusHexColors.cleaning,
  "cleaned",
  nplStatusHexColors.cleaned,
  "verified",
  nplStatusHexColors.verified,
  nplStatusHexColors.listed,
];

const focusedOpacity = 0.9;
const dimmedOpacity = 0.2;
const lowZoomLevel = 3;
const highZoomLevel = 10;
const selectedRadiusAtLowZoom = 7.5;
const defaultRadiusAtLowZoom = 4.5;
const selectedRadiusAtHighZoom = 18;
const defaultRadiusAtHighZoom = 11;

const buildOpacityExpression = (status?: SiteNPLStatus): number | ExpressionSpecification =>
  status
    ? ([
        "case",
        ["!=", ["get", "npl"], status],
        dimmedOpacity,
        focusedOpacity,
      ] satisfies ExpressionSpecification)
    : focusedOpacity;

const buildRadiusExpression = (selectedId: string): ExpressionSpecification =>
  [
    "interpolate",
    ["linear"],
    ["zoom"],
    lowZoomLevel,
    ["case", ["==", ["get", "id"], selectedId], selectedRadiusAtLowZoom, defaultRadiusAtLowZoom],
    highZoomLevel,
    ["case", ["==", ["get", "id"], selectedId], selectedRadiusAtHighZoom, defaultRadiusAtHighZoom],
  ] satisfies ExpressionSpecification;

type CirclePaint = NonNullable<Extract<LayerProps, { type: "circle" }>["paint"]>;

function MainCard({ title, children, ...props }: PropsWithChildren<{ title?: string }>) {
  return (
    <Drawer.Root disablePointerDismissal modal={false} open>
      <Drawer.VirtualKeyboardProvider>
        <Drawer.Portal>
          <Drawer.Viewport className="pointer-events-none fixed inset-0 z-10 md:absolute md:inset-0">
            <Drawer.Popup
              className={clsx(
                "pointer-events-auto fixed bottom-[var(--drawer-keyboard-inset,0px)] max-h-[calc(50svb+env(safe-area-inset-bottom))] max-md:right-1 max-md:left-1",
                "md:absolute md:top-8 md:bottom-auto md:left-8 md:w-full md:max-w-xl",
              )}
              initialFocus={false}
            >
              <Drawer.Content
                {...props}
                className={clsx(
                  "main-card rounded-t-2xl backdrop-blur-lg backdrop-saturate-150 md:rounded-2xl",
                  "overflow-y-auto! touch-auto! overflow-x-clip outline-none [scrollbar-width:thin]",
                  "@container flex max-h-[calc(50svb+env(safe-area-inset-bottom))] flex-col overscroll-contain px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:max-h-[90vh] md:p-6",
                  "select-auto! font-mono text-sm leading-relaxed",
                )}
              >
                <div data-base-ui-swipe-ignore>
                  {title && (
                    <Drawer.Title className="text-balance font-bold font-sans text-3xl">
                      {title}
                    </Drawer.Title>
                  )}
                  {children}
                </div>
              </Drawer.Content>
            </Drawer.Popup>
          </Drawer.Viewport>
        </Drawer.Portal>
      </Drawer.VirtualKeyboardProvider>
    </Drawer.Root>
  );
}

const initialViewState = {
  bearing: 0,
  latitude: 39.8283,
  longitude: -98.5795,
  pitch: 20,
  zoom: 4,
};

const siteLayerId = "site-points";

export default function MapLayoutClient({ children }: PropsWithChildren<object>) {
  const router = useRouter();
  const pathname = usePathname();
  const { site: siteId, status: nplStatus } = useParams();

  const mapRef = useRef<MapRef | null>(null);
  const [cursor, setCursor] = useState<string | undefined>();
  const [pendingSelectedId, setPendingSelectedId] = useState<string | null>(null);
  const lastNplStatusRef = useRef<SiteNPLStatus | undefined>();

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

  useEffect(() => {
    if (activeNplStatus) {
      lastNplStatusRef.current = activeNplStatus;
      return;
    }
    if (!pathname.startsWith("/npl/")) {
      lastNplStatusRef.current = undefined;
    }
  }, [activeNplStatus, pathname]);

  const displayedNplStatus =
    activeNplStatus ?? (pathname.startsWith("/npl/") ? lastNplStatusRef.current : undefined);

  useEffect(() => {
    if (!pendingSelectedId) {
      return;
    }
    if (!activeSiteId || pendingSelectedId === activeSiteId) {
      setPendingSelectedId(null);
    }
  }, [pendingSelectedId, activeSiteId]);

  const siteCircleLayer = useMemo<LayerProps>(() => {
    const selectedId = pendingSelectedId ?? activeSiteId ?? "";

    const paint: CirclePaint = {
      "circle-color": circleColorExpression,
      "circle-opacity": buildOpacityExpression(displayedNplStatus),
      "circle-radius": buildRadiusExpression(selectedId),
    };

    const layer: LayerProps = {
      id: siteLayerId,
      paint,
      source: "sites",
      type: "circle",
    } satisfies LayerProps;

    return layer;
  }, [displayedNplStatus, activeSiteId, pendingSelectedId]);

  const handleMapClick = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    const featureId = feature?.properties?.id;
    if (typeof featureId === "string") {
      setPendingSelectedId(featureId);
      router.push(`/sites/${featureId}`);
    }
  };

  const handleMouseMove = (event: MapMouseEvent) => {
    const feature = event.features?.[0];
    setCursor(feature ? "pointer" : undefined);
  };

  return (
    <div className="h-full w-full">
      <MapProvider>
        <style>{".mapboxgl-canvas, .mapboxgl-marker { position: absolute !important; }"}</style>
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
            height: "100vh",
            inset: 0,
            position: "absolute",
            width: "100%",
          }}
        >
          <GeolocateControl />
          <NavigationControl position="top-right" showCompass={false} visualizePitch={false} />
          <Source data="/sites.geojson" id="sites" type="geojson">
            <Layer {...siteCircleLayer} />
          </Source>
          <MainCard>{children}</MainCard>
        </MapComponent>
      </MapProvider>
    </div>
  );
}
