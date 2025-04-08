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
    // @ts-expect-error global
    window.mapRef.current?.flyTo({
      center: { lat: center[0], lng: center[1] },
      zoom,
      duration,
    });
  }, [center, zoom, duration]);
  return null;
}
