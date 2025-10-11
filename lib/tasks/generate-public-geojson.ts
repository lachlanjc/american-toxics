#!/usr/bin/env bun

import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import type { FeatureCollection, Point } from "geojson";

import type { SiteNPLStatus } from "../data/site";
import SITES from "../data/sites-mini.json" with { type: "json" };

type SiteFeatureProperties = {
  npl: SiteNPLStatus;
};

const OUTPUT_PATH = resolve(process.cwd(), "public/sites.geojson");

const geojson: FeatureCollection<Point, SiteFeatureProperties> = {
  type: "FeatureCollection",
  features: SITES.map((marker) => ({
    type: "Feature",
    id: marker.id,
    geometry: {
      type: "Point",
      coordinates: [marker.lng, marker.lat],
    },
    properties: {
      npl: marker.npl as SiteNPLStatus,
    },
  })),
};

await mkdir(dirname(OUTPUT_PATH), { recursive: true });
await Bun.write(OUTPUT_PATH, `${JSON.stringify(geojson)}\n`);

console.log(`Wrote ${geojson.features.length} features to ${OUTPUT_PATH}`);
