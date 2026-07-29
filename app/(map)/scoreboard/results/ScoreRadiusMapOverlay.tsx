"use client";

import type {
  LngLatBoundsLike,
  Map as MapboxMap,
  PaddingOptions,
} from "mapbox-gl";
import { useEffect, useEffectEvent } from "react";
import { useMap } from "react-map-gl/mapbox";
import { nplStatusHexColors, type SiteNPLStatus } from "@/lib/data/site";

const sourceId = "scoreboard-radius";
const fillLayerId = "scoreboard-radius-fill";
const outlineLayerId = "scoreboard-radius-outline";
const siteLayerId = "site-points";
const earthRadiusMiles = 3958.7613;
const defaultOverlayColor = nplStatusHexColors.listed;

function getMapPadding(map: MapboxMap): PaddingOptions | undefined {
  const isNarrowScreen = window.matchMedia("(width < 48rem)").matches;

  if (isNarrowScreen) {
    const containerHeight = map.getContainer().clientHeight;
    if (Number.isFinite(containerHeight)) {
      return {
        top: 32,
        right: 24,
        bottom: containerHeight * 0.5 + 32,
        left: 24,
      };
    }
    return undefined;
  }

  const containerWidth = map.getContainer().clientWidth;
  if (Number.isFinite(containerWidth)) {
    return {
      top: 32,
      right: 32,
      bottom: 32,
      left: containerWidth * 0.4 + 32,
    };
  }

  return undefined;
}

function buildCircleCoordinates(
  latitude: number,
  longitude: number,
  radiusMiles: number,
  points = 96
) {
  const angularDistance = radiusMiles / earthRadiusMiles;
  const latitudeRadians = (latitude * Math.PI) / 180;
  const longitudeRadians = (longitude * Math.PI) / 180;
  const coordinates: [number, number][] = [];

  for (let pointIndex = 0; pointIndex <= points; pointIndex += 1) {
    const bearing = (2 * Math.PI * pointIndex) / points;
    const pointLatitude = Math.asin(
      Math.sin(latitudeRadians) * Math.cos(angularDistance) +
        Math.cos(latitudeRadians) *
          Math.sin(angularDistance) *
          Math.cos(bearing)
    );
    const pointLongitude =
      longitudeRadians +
      Math.atan2(
        Math.sin(bearing) *
          Math.sin(angularDistance) *
          Math.cos(latitudeRadians),
        Math.cos(angularDistance) -
          Math.sin(latitudeRadians) * Math.sin(pointLatitude)
      );

    coordinates.push([
      ((((pointLongitude * 180) / Math.PI) + 540) % 360) - 180,
      (pointLatitude * 180) / Math.PI,
    ]);
  }

  return coordinates;
}

function cleanupMapOverlay(map: MapboxMap) {
  if (map.getLayer(outlineLayerId)) {
    map.removeLayer(outlineLayerId);
  }
  if (map.getLayer(fillLayerId)) {
    map.removeLayer(fillLayerId);
  }
  if (map.getSource(sourceId)) {
    map.removeSource(sourceId);
  }
}

function syncMapOverlay({
  map,
  center: [latitude, longitude],
  radiusMiles,
  duration,
  status,
}: {
  map: MapboxMap;
  center: [number, number];
  radiusMiles: number;
  duration: number;
  status?: SiteNPLStatus | null;
}) {
  if (!map.isStyleLoaded()) {
    return;
  }

  const padding = getMapPadding(map);
  const overlayColor = status ? nplStatusHexColors[status] : defaultOverlayColor;

  if (radiusMiles <= 0) {
    cleanupMapOverlay(map);
    map.flyTo({
      center: { lat: latitude, lng: longitude },
      duration,
      zoom: 14,
      ...(padding ? { padding } : {}),
    });
    return;
  }

  const coordinates = buildCircleCoordinates(latitude, longitude, radiusMiles);
  const circleData = {
    type: "FeatureCollection" as const,
    features: [
      {
        type: "Feature" as const,
        properties: {},
        geometry: {
          type: "Polygon" as const,
          coordinates: [coordinates],
        },
      },
    ],
  };

  const existingSource = map.getSource(sourceId);
  if (existingSource && "setData" in existingSource) {
    existingSource.setData(circleData);
  } else {
    map.addSource(sourceId, {
      type: "geojson",
      data: circleData,
    });
  }

  const insertionPoint = map.getLayer(siteLayerId) ? siteLayerId : undefined;

  if (!map.getLayer(fillLayerId)) {
    map.addLayer(
      {
        id: fillLayerId,
        type: "fill",
        source: sourceId,
        paint: {
          "fill-color": overlayColor,
          "fill-opacity": 0.12,
        },
      },
      insertionPoint
    );
  }

  if (!map.getLayer(outlineLayerId)) {
    map.addLayer(
      {
        id: outlineLayerId,
        type: "line",
        source: sourceId,
        paint: {
          "line-color": overlayColor,
          "line-opacity": 0.85,
          "line-width": 2,
        },
      },
      insertionPoint
    );
  } else {
    map.setPaintProperty(fillLayerId, "fill-color", overlayColor);
    map.setPaintProperty(outlineLayerId, "line-color", overlayColor);
  }

  const longitudes = coordinates.map(([pointLongitude]) => pointLongitude);
  const latitudes = coordinates.map(([, pointLatitude]) => pointLatitude);
  const bounds: LngLatBoundsLike = [
    [Math.min(...longitudes), Math.min(...latitudes)],
    [Math.max(...longitudes), Math.max(...latitudes)],
  ];

  map.fitBounds(bounds, {
    duration,
    maxZoom: 13,
    ...(padding ? { padding } : {}),
  });
}

export function ScoreRadiusMapOverlay({
  center,
  radiusMiles,
  duration = 2000,
  status,
}: {
  center: [number, number];
  radiusMiles: number;
  duration?: number;
  status?: SiteNPLStatus | null;
}) {
  const { current: mapRef } = useMap();

  const syncOverlay = useEffectEvent(() => {
    if (!mapRef) {
      return;
    }

    syncMapOverlay({
      map: mapRef.getMap(),
      center,
      radiusMiles,
      duration,
      status,
    });
  });

  useEffect(() => {
    if (!mapRef) {
      return;
    }

    const map = mapRef.getMap();
    const handleStyleData = () => {
      syncOverlay();
    };

    map.on("styledata", handleStyleData);
    syncOverlay();

    return () => {
      map.off("styledata", handleStyleData);
      cleanupMapOverlay(map);
    };
  }, [mapRef, syncOverlay]);

  useEffect(() => {
    syncOverlay();
  }, [center, duration, radiusMiles, status, syncOverlay]);

  return null;
}
