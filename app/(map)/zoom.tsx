"use client";

import { useEffect } from "react";

export function MapZoom({
  center,
  zoom = 14,
  duration = 2000,
}: {
  center: [number, number];
  zoom?: number;
  duration?: number;
}) {
  useEffect(() => {
    let timeout: NodeJS.Timer | undefined;
    const fly = () =>
      // @ts-expect-error global
      window.mapRef.current?.flyTo({
        center: { lat: center[0], lng: center[1] },
        zoom,
        duration,
      });
    // @ts-expect-error global
    if (window.mapRef.current) {
      fly();
    } else {
      timeout = setTimeout(fly, 2000);
    }
    // return () => {
    //   if (timeout) clearTimeout(timeout);
    // };
  }, [center, zoom, duration]);
  return null;
}
