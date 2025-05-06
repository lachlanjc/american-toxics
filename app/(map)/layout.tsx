"use client";

import { PropsWithChildren, useEffect, useMemo, useRef } from "react";
import { Drawer } from "vaul";
import "mapbox-gl/dist/mapbox-gl.css";
import SITES from "@/lib/data/sites-mini.json" assert { type: "json" };
import Map, {
  GeolocateControl,
  MapProvider,
  MapRef,
  Marker,
  NavigationControl,
} from "react-map-gl/mapbox";
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

const statuses: Record<SiteNPLStatus, string> = {
  proposed: "fill-amber-500",
  listed: "fill-primary",
  cleaning: "fill-fuchsia-500",
  cleaned: "fill-sky-500",
  completed: "fill-teal-500 opacity-70",
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

  const markers = useMemo(() => {
    return SITES.map((marker) => (
      <Marker
        anchor="bottom"
        longitude={marker.lng}
        latitude={marker.lat}
        onClick={() => {
          router.push(`/sites/${marker.id}`);
        }}
        key={marker.id}
        className={`relative ${nplStatus && nplStatus !== marker.npl ? "relative -z-1" : ""}`}
      >
        <svg
          className={clsx(
            "pin",
            "transition-transform duration-500 origin-bottom",
            siteId && siteId === marker.id ? "scale-200 !opacity-100" : null,
            statuses[marker.npl as SiteNPLStatus],
          )}
          width={24}
          height={24}
          viewBox="0 0 24 24"
        >
          {/* <title>{marker.name}</title> */}
          <path
            d={`M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3 c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9 C20.1,15.8,20.2,15.8,20.2,15.7z`}
          />
        </svg>
      </Marker>
    ));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nplStatus, siteId]);

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
        >
          <GeolocateControl />
          <NavigationControl
            position="top-right"
            showCompass={false}
            visualizePitch={false}
          />
          {markers}
        </Map>
        <MainCard>{children}</MainCard>
      </MapProvider>
    </div>
  );
}
