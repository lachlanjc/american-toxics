"use client";

import { useEffect } from "react";
import type { MapRef } from "react-map-gl/mapbox";
import type { PaddingOptions } from "mapbox-gl";

type WindowWithMapRef = Window &
  typeof globalThis & {
    mapRef?: { current?: MapRef | null };
  };

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
    const fly = () => {
      const map = (window as WindowWithMapRef).mapRef?.current;
      if (!map) {
        return;
      }

      const [lat, lng] = center;

      let padding: PaddingOptions | undefined;
      // On mobile the sheet is covering the bottom 50% of the map
      // so we want to compensate by flying to a point lower down the map
      // On desktop we have a sidebar covering the left 40% of the map
      const isNarrowScreen = window.matchMedia('(width < 48rem)').matches;

      if (isNarrowScreen) {
        const containerHeight = map.getContainer().clientHeight;
        if (Number.isFinite(containerHeight)) {
          padding = { bottom: containerHeight * 0.5 };
        }
      } else {
        const containerWidth = map.getContainer().clientWidth;
        if (Number.isFinite(containerWidth)) {
          padding = { left: containerWidth * 0.4 };
        }
      }

      map.flyTo({
        center: { lat, lng },
        zoom,
        duration,
        ...(padding ? { padding } : {}),
      });
    };

    const map = (window as WindowWithMapRef).mapRef?.current;
    if (map) {
      fly();
      return;
    }

    const timeout = setTimeout(fly, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [center, zoom, duration]);
  return null;
}
