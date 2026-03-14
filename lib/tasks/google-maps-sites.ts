/* biome-ignore-all lint/style/noMagicNumbers: this task script intentionally uses explicit numeric tuning constants */

import { readFile, writeFile } from "node:fs/promises";
import type { Site } from "@/lib/data/site";
import SITES from "@/lib/data/sites.json" with { type: "json" };

const MATCHES_PATH = "lib/data/sites-google-maps.json";
const MISSES_PATH = "lib/data/sites-google-maps-misses.json";
const REVIEW_PATH = "lib/data/sites-google-maps-review.json";
const GOOGLE_PLACES_URL = "https://places.googleapis.com/v1/places:searchText";

const MAX_DISTANCE_MILES = 10;
const NAME_SCORE_THRESHOLD = 0.3;
const CLOSE_DISTANCE_MILES = 0.5;
const CLOSE_DISTANCE_NAME_THRESHOLD = 0.18;
const ACCEPTANCE_MATCH_SCORE_THRESHOLD = 0.45;
const REVIEW_MATCH_SCORE_THRESHOLD = 0.6;
const NAME_WEIGHT = 0.7;
const DISTANCE_WEIGHT = 0.3;
const DEFAULT_CONCURRENCY = 8;
const API_RETRY_CONCURRENCY = 3;
const MAX_RESULTS = 5;
const LOCATION_BIAS_RADIUS_METERS = 50_000;
const RETRY_ATTEMPTS = 4;
const RETRY_BASE_DELAY_MS = 500;
const RETRY_JITTER_MS = 200;
const HTTP_TOO_MANY_REQUESTS = 429;
const HTTP_SERVER_ERROR_MIN = 500;
const HTTP_SERVER_ERROR_MAX = 599;
const HTTP_BAD_REQUEST_MIN = 400;
const PROGRESS_LOG_INTERVAL = 25;
const ROUND_PRECISION = 1000;
const EARTH_RADIUS_MILES = 3958.7613;
const DEGREES_IN_CIRCLE = 180;
const MIN_CONTAINS_LENGTH = 5;
const CONTAINS_SCORE_BOOST = 0.2;
const ALMOST_ZERO = 0.000_001;
const TEN_MILES_LAT_DIVISOR = 69;
const TEN_MILES_MIN = 9.8;
const TEN_MILES_MAX = 10.2;
const ERROR_TEXT_MAX_LENGTH = 500;
const ARGS_START_INDEX = 2;

const REQUIRE_SUPERFUND_SIGNAL = true;

type MissReason =
  | "no_results"
  | "distance_too_far"
  | "name_mismatch"
  | "not_hazard_listing"
  | "api_error";

type CliOptions = {
  limit?: number;
  offset: number;
  onlyState?: string;
  overwrite: boolean;
  retryApiErrors: boolean;
  concurrency: number;
};

type GooglePlace = {
  id?: string;
  displayName?: {
    text?: string;
    languageCode?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  googleMapsUri?: string;
  types?: string[];
  businessStatus?: string;
  rating?: number;
  userRatingCount?: number;
};

type PlacesSearchResponse = {
  places?: GooglePlace[];
};

type SiteGoogleMapsMetadata = {
  placeId: string;
  googleMapsUri: string;
  displayName: string;
  formattedAddress: string;
  location: {
    lat: number;
    lng: number;
  };
  types: string[];
  businessStatus?: string;
  rating?: number;
  userRatingCount?: number;
  sourceQuery: string;
  matchScore: number;
  distanceMiles: number;
};

type CandidateSummary = {
  displayName: string;
  googleMapsUri?: string;
  distanceMiles?: number;
  nameScore: number;
  matchScore: number;
};

type SiteMissRecord = {
  reason: MissReason;
  sourceQuery: string;
  statusCode?: number;
  error?: string;
  topCandidate?: CandidateSummary;
};

type SiteReviewRecord = {
  reason: "low_confidence" | "suspicious_type";
  sourceQuery: string;
  candidate: CandidateSummary;
};

type EvaluatedCandidate = {
  place: GooglePlace;
  distanceMiles?: number;
  nameScore: number;
  matchScore: number;
  accepted: boolean;
  requiresReview: boolean;
  reviewReason?: SiteReviewRecord["reason"];
  rejectReason?: Exclude<MissReason, "api_error" | "no_results">;
};

type SearchResult = {
  places: GooglePlace[];
  statusCode: number;
  errorText?: string;
};

type SelectionResult = {
  metadata?: SiteGoogleMapsMetadata;
  review?: SiteReviewRecord;
  missReason?: Exclude<MissReason, "api_error" | "no_results">;
  topCandidate?: CandidateSummary;
};

type ProcessResult =
  | {
      kind: "match";
      siteId: string;
      metadata: SiteGoogleMapsMetadata;
    }
  | {
      kind: "review";
      siteId: string;
      record: SiteReviewRecord;
    }
  | {
      kind: "miss";
      siteId: string;
      record: SiteMissRecord;
    };

type MatchesBySiteId = Record<string, SiteGoogleMapsMetadata>;
type MissesBySiteId = Record<string, SiteMissRecord>;
type ReviewsBySiteId = Record<string, SiteReviewRecord>;

const STOPWORDS = new Set([
  "and",
  "at",
  "co",
  "company",
  "corp",
  "corporation",
  "facility",
  "inc",
  "landfill",
  "llc",
  "plant",
  "site",
  "superfund",
  "the",
]);

const SUSPICIOUS_PLACE_TYPES = new Set([
  "route",
  "locality",
  "political",
  "neighborhood",
]);

const ACCEPTABLE_PLACE_TYPES = new Set([
  "point_of_interest",
  "establishment",
  "manufacturer",
  "government_office",
  "historical_place",
  "historical_landmark",
  "museum",
  "park",
  "natural_feature",
]);

const HAZARD_SIGNAL_TERMS = [
  "superfund",
  "hazardous",
  "contamination",
  "contaminated",
  "toxic",
  "pollution",
  "cleanup",
];
const SUPERFUND_REGEX = /super\s*fund/;

function log(message: string): void {
  process.stdout.write(`${message}\n`);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function parseState(value: string | undefined): string {
  if (!value) {
    throw new Error("Missing value for --only-state");
  }
  return value.trim().toUpperCase();
}

function parseNonNegativeInteger(
  value: string | undefined,
  argName: string
): number {
  if (!value) {
    throw new Error(`Missing value for ${argName}`);
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`Invalid ${argName} value: ${value}`);
  }
  return parsed;
}

function parsePositiveInteger(
  value: string | undefined,
  argName: string
): number {
  const parsed = parseNonNegativeInteger(value, argName);
  if (parsed < 1) {
    throw new Error(`${argName} must be >= 1`);
  }
  return parsed;
}

function nextValue(args: string[], index: number, argName: string): string {
  const value = args.at(index + 1);
  if (!value) {
    throw new Error(`Missing value for ${argName}`);
  }
  return value;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: CLI parsing branches are explicit for readability.
function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    offset: 0,
    overwrite: false,
    retryApiErrors: false,
    concurrency: DEFAULT_CONCURRENCY,
  };

  for (let index = 0; index < args.length; index += 1) {
    const rawArg = args.at(index);
    if (!rawArg) {
      continue;
    }

    const splitIndex = rawArg.indexOf("=");
    const flag = splitIndex >= 0 ? rawArg.slice(0, splitIndex) : rawArg;
    const inlineValue =
      splitIndex >= 0 ? rawArg.slice(splitIndex + 1) : undefined;

    switch (flag) {
      case "--overwrite": {
        options.overwrite = true;
        break;
      }
      case "--retry-api-errors": {
        options.retryApiErrors = true;
        break;
      }
      case "--limit": {
        const value = inlineValue ?? nextValue(args, index, "--limit");
        options.limit = parseNonNegativeInteger(value, "--limit");
        if (!inlineValue) {
          index += 1;
        }
        break;
      }
      case "--offset": {
        const value = inlineValue ?? nextValue(args, index, "--offset");
        options.offset = parseNonNegativeInteger(value, "--offset");
        if (!inlineValue) {
          index += 1;
        }
        break;
      }
      case "--only-state": {
        const value = inlineValue ?? nextValue(args, index, "--only-state");
        options.onlyState = parseState(value);
        if (!inlineValue) {
          index += 1;
        }
        break;
      }
      case "--concurrency": {
        const value = inlineValue ?? nextValue(args, index, "--concurrency");
        options.concurrency = parsePositiveInteger(value, "--concurrency");
        if (!inlineValue) {
          index += 1;
        }
        break;
      }
      default: {
        throw new Error(`Unknown argument: ${rawArg}`);
      }
    }
  }

  return options;
}

function normalizeName(value: string): string {
  const aliased = value
    .toLowerCase()
    .replaceAll(/naval air station/g, "air base")
    .replaceAll(/air force base/g, "air base")
    .replaceAll(/federal airfield/g, "air base")
    .replaceAll(/airfield/g, "air base")
    .replaceAll(/airport/g, "air base")
    .replaceAll(/ground water/g, "groundwater")
    .replaceAll(/corp\b/g, "corporation")
    .replaceAll(/co\b/g, "company");

  const cleaned = aliased
    .replaceAll("&", " and ")
    .replaceAll(/[^a-z0-9\s]/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim();
  if (!cleaned) {
    return "";
  }

  const words: string[] = [];
  for (const token of cleaned.split(" ")) {
    if (token.length <= 1 || STOPWORDS.has(token)) {
      continue;
    }
    words.push(token);
  }
  return words.join(" ").trim();
}

function normalizeText(value: string): string {
  return value.toLowerCase().replaceAll(/\s+/g, " ").trim();
}

function tokenSimilarity(a: string, b: string): number {
  if (!(a && b)) {
    return 0;
  }

  const aTokens = new Set(a.split(" "));
  const bTokens = new Set(b.split(" "));
  let overlap = 0;

  for (const token of aTokens) {
    if (bTokens.has(token)) {
      overlap += 1;
    }
  }

  const unionSize = aTokens.size + bTokens.size - overlap;
  if (unionSize === 0) {
    return 0;
  }
  return overlap / unionSize;
}

function nameSimilarity(siteName: string, placeName: string): number {
  const normalizedSite = normalizeName(siteName);
  const normalizedPlace = normalizeName(placeName);
  const tokenScore = tokenSimilarity(normalizedSite, normalizedPlace);

  let containsBoost = 0;
  if (
    normalizedSite.length >= MIN_CONTAINS_LENGTH &&
    normalizedPlace.length >= MIN_CONTAINS_LENGTH &&
    (normalizedSite.includes(normalizedPlace) ||
      normalizedPlace.includes(normalizedSite))
  ) {
    containsBoost = CONTAINS_SCORE_BOOST;
  }
  return Math.min(1, tokenScore + containsBoost);
}

function hasAnySuspiciousType(types: string[] | undefined): boolean {
  if (!types || types.length === 0) {
    return false;
  }
  for (const type of types) {
    if (SUSPICIOUS_PLACE_TYPES.has(type.toLowerCase())) {
      return true;
    }
  }
  return false;
}

function hasAcceptableType(types: string[] | undefined): boolean {
  if (!types || types.length === 0) {
    return false;
  }
  for (const type of types) {
    if (ACCEPTABLE_PLACE_TYPES.has(type.toLowerCase())) {
      return true;
    }
  }
  return false;
}

function hasHazardSignal(place: GooglePlace): boolean {
  const corpus = normalizeText(
    `${place.displayName?.text ?? ""} ${place.formattedAddress ?? ""}`
  );
  if (!corpus) {
    return false;
  }

  let hasTerm = false;
  for (const term of HAZARD_SIGNAL_TERMS) {
    if (corpus.includes(term)) {
      hasTerm = true;
      break;
    }
  }
  if (!hasTerm) {
    return false;
  }
  if (!REQUIRE_SUPERFUND_SIGNAL) {
    return true;
  }
  return SUPERFUND_REGEX.test(corpus);
}

function hasExplicitSuperfundDisplayName(place: GooglePlace): boolean {
  const display = normalizeText(place.displayName?.text ?? "");
  return SUPERFUND_REGEX.test(display);
}

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / DEGREES_IN_CIRCLE;
}

function haversineMiles(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLng / 2) ** 2 * Math.cos(lat1Rad) * Math.cos(lat2Rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_MILES * c;
}

function round(value: number): number {
  return Math.round(value * ROUND_PRECISION) / ROUND_PRECISION;
}

function buildPrimaryQuery(site: Site): string {
  const state = site.stateCode || site.stateName;
  return `${site.name}, ${site.city}, ${state}, superfund`;
}

function buildFallbackQueries(site: Site): string[] {
  const state = site.stateCode || site.stateName;
  const queries = [
    buildPrimaryQuery(site),
    `${site.name}, ${site.city}, ${state}`,
    `${site.name}, ${state}`,
  ];
  const deduped: string[] = [];
  const seen = new Set<string>();
  for (const query of queries) {
    if (seen.has(query)) {
      continue;
    }
    seen.add(query);
    deduped.push(query);
  }
  return deduped;
}

function summarizeCandidate(candidate: EvaluatedCandidate): CandidateSummary {
  return {
    displayName: candidate.place.displayName?.text ?? "Unknown",
    googleMapsUri: candidate.place.googleMapsUri,
    distanceMiles: candidate.distanceMiles,
    nameScore: round(candidate.nameScore),
    matchScore: round(candidate.matchScore),
  };
}

function evaluateCandidate(site: Site, place: GooglePlace): EvaluatedCandidate {
  const displayName = place.displayName?.text ?? "";
  const nameScore = nameSimilarity(site.name, displayName);
  const lat = place.location?.latitude;
  const lng = place.location?.longitude;

  if (lat === undefined || lng === undefined) {
    return {
      place,
      nameScore,
      matchScore: 0,
      accepted: false,
      requiresReview: false,
      rejectReason: "name_mismatch",
    };
  }

  const distanceMiles = haversineMiles(site.lat, site.lng, lat, lng);
  const distanceScore = Math.max(0, 1 - distanceMiles / MAX_DISTANCE_MILES);
  const isCloseDistance = distanceMiles <= CLOSE_DISTANCE_MILES;
  const effectiveNameThreshold = isCloseDistance
    ? CLOSE_DISTANCE_NAME_THRESHOLD
    : NAME_SCORE_THRESHOLD;
  const matchScore = nameScore * NAME_WEIGHT + distanceScore * DISTANCE_WEIGHT;

  if (distanceMiles > MAX_DISTANCE_MILES) {
    return {
      place,
      distanceMiles,
      nameScore,
      matchScore,
      accepted: false,
      requiresReview: false,
      rejectReason: "distance_too_far",
    };
  }
  if (nameScore < effectiveNameThreshold) {
    return {
      place,
      distanceMiles,
      nameScore,
      matchScore,
      accepted: false,
      requiresReview: false,
      rejectReason: "name_mismatch",
    };
  }
  if (matchScore < ACCEPTANCE_MATCH_SCORE_THRESHOLD) {
    return {
      place,
      distanceMiles,
      nameScore,
      matchScore,
      accepted: false,
      requiresReview: false,
      rejectReason: "name_mismatch",
    };
  }

  const hasSuspiciousType = hasAnySuspiciousType(place.types);
  const hasNonSuspiciousType = hasAcceptableType(place.types);
  const hasExplicitSuperfundName = hasExplicitSuperfundDisplayName(place);
  if (hasSuspiciousType && !hasNonSuspiciousType) {
    return {
      place,
      distanceMiles,
      nameScore,
      matchScore,
      accepted: false,
      requiresReview: false,
      rejectReason: "not_hazard_listing",
    };
  }
  if (!hasHazardSignal(place)) {
    return {
      place,
      distanceMiles,
      nameScore,
      matchScore,
      accepted: false,
      requiresReview: false,
      rejectReason: "not_hazard_listing",
    };
  }

  const requiresReview =
    hasSuspiciousType ||
    (matchScore < REVIEW_MATCH_SCORE_THRESHOLD && !hasExplicitSuperfundName);

  return {
    place,
    distanceMiles,
    nameScore,
    matchScore,
    accepted: true,
    requiresReview,
    reviewReason: hasSuspiciousType ? "suspicious_type" : "low_confidence",
  };
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: candidate ranking and review/match branching are intentionally explicit.
function chooseBestCandidate(
  site: Site,
  places: GooglePlace[],
  sourceQuery: string
): SelectionResult {
  const evaluated: EvaluatedCandidate[] = [];
  for (const place of places) {
    evaluated.push(evaluateCandidate(site, place));
  }

  const accepted: EvaluatedCandidate[] = [];
  for (const candidate of evaluated) {
    if (candidate.accepted) {
      accepted.push(candidate);
    }
  }

  accepted.sort((left, right) => {
    if (right.matchScore !== left.matchScore) {
      return right.matchScore - left.matchScore;
    }
    return (
      (left.distanceMiles ?? Number.POSITIVE_INFINITY) -
      (right.distanceMiles ?? Number.POSITIVE_INFINITY)
    );
  });

  const winner = accepted.at(0);
  if (winner) {
    const placeId = winner.place.id;
    const mapsUri = winner.place.googleMapsUri;
    const displayName = winner.place.displayName?.text;
    const lat = winner.place.location?.latitude;
    const lng = winner.place.location?.longitude;
    if (
      !(placeId && mapsUri && displayName) ||
      lat === undefined ||
      lng === undefined ||
      winner.distanceMiles === undefined
    ) {
      return {
        missReason: "name_mismatch",
        topCandidate: summarizeCandidate(winner),
      };
    }

    const candidate = summarizeCandidate(winner);
    if (winner.requiresReview) {
      return {
        review: {
          reason: winner.reviewReason ?? "low_confidence",
          sourceQuery,
          candidate,
        },
        topCandidate: candidate,
      };
    }

    return {
      metadata: {
        placeId,
        googleMapsUri: mapsUri,
        displayName,
        formattedAddress: winner.place.formattedAddress ?? "",
        location: { lat, lng },
        types: winner.place.types ?? [],
        businessStatus: winner.place.businessStatus,
        rating: winner.place.rating,
        userRatingCount: winner.place.userRatingCount,
        sourceQuery,
        matchScore: round(winner.matchScore),
        distanceMiles: round(winner.distanceMiles),
      },
      topCandidate: candidate,
    };
  }

  evaluated.sort((left, right) => {
    if (right.matchScore !== left.matchScore) {
      return right.matchScore - left.matchScore;
    }
    return (
      (left.distanceMiles ?? Number.POSITIVE_INFINITY) -
      (right.distanceMiles ?? Number.POSITIVE_INFINITY)
    );
  });

  const top = evaluated.at(0);
  if (!top) {
    return {};
  }

  return {
    missReason: top.rejectReason ?? "name_mismatch",
    topCandidate: summarizeCandidate(top),
  };
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  maxAttempts: number
): Promise<Response> {
  let attempt = 0;
  let delayMs = RETRY_BASE_DELAY_MS;
  while (attempt < maxAttempts) {
    attempt += 1;
    try {
      const response = await fetch(url, init);
      const isTransient =
        response.status === HTTP_TOO_MANY_REQUESTS ||
        (response.status >= HTTP_SERVER_ERROR_MIN &&
          response.status <= HTTP_SERVER_ERROR_MAX);
      if (!isTransient || attempt >= maxAttempts) {
        return response;
      }
    } catch (error) {
      if (attempt >= maxAttempts) {
        throw error;
      }
    }

    const jitter = Math.floor(Math.random() * RETRY_JITTER_MS);
    await delay(delayMs + jitter);
    delayMs *= 2;
  }
  throw new Error("Failed to fetch after retries");
}

async function searchPlaces(
  site: Site,
  query: string,
  apiKey: string
): Promise<SearchResult> {
  const body = {
    textQuery: query,
    languageCode: "en",
    maxResultCount: MAX_RESULTS,
    locationBias: {
      circle: {
        center: {
          latitude: site.lat,
          longitude: site.lng,
        },
        radius: LOCATION_BIAS_RADIUS_METERS,
      },
    },
  };

  const response = await fetchWithRetry(
    GOOGLE_PLACES_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.types,places.businessStatus,places.rating,places.userRatingCount",
      },
      body: JSON.stringify(body),
    },
    RETRY_ATTEMPTS
  );

  if (!response.ok) {
    const errorText = (await response.text()).slice(0, ERROR_TEXT_MAX_LENGTH);
    return {
      places: [],
      statusCode: response.status,
      errorText,
    };
  }

  const payload = (await response.json()) as PlacesSearchResponse;
  return {
    places: payload.places ?? [],
    statusCode: response.status,
  };
}

async function loadJsonRecord<T>(
  path: string,
  overwrite: boolean
): Promise<Record<string, T>> {
  if (overwrite) {
    return {};
  }
  try {
    const raw = await readFile(path, "utf8");
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") {
      throw new Error(`${path} must contain a JSON object`);
    }
    return parsed as Record<string, T>;
  } catch (error) {
    if (
      error instanceof Error &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT"
    ) {
      return {};
    }
    throw error;
  }
}

function sortObjectByKeys<T>(input: Record<string, T>): Record<string, T> {
  const sorted: Record<string, T> = {};
  const keys = Object.keys(input).sort((left, right) =>
    left.localeCompare(right)
  );
  for (const key of keys) {
    sorted[key] = input[key] as T;
  }
  return sorted;
}

function filterSites(sites: Site[], options: CliOptions): Site[] {
  let scoped = sites;
  if (options.onlyState) {
    scoped = scoped.filter((site) => {
      const stateCode = site.stateCode?.toUpperCase();
      const stateName = site.stateName?.toUpperCase();
      return stateCode === options.onlyState || stateName === options.onlyState;
    });
  }
  if (options.offset > 0) {
    scoped = scoped.slice(options.offset);
  }
  if (options.limit !== undefined) {
    scoped = scoped.slice(0, options.limit);
  }
  return scoped;
}

function ensure(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message);
  }
}

function validateOutputs(
  matches: MatchesBySiteId,
  misses: MissesBySiteId,
  reviews: ReviewsBySiteId,
  allSites: Site[]
): void {
  const siteIds = new Set(allSites.map((site) => site.id));
  for (const id of Object.keys(matches)) {
    ensure(siteIds.has(id), `Unknown site id in matches: ${id}`);
  }
  for (const id of Object.keys(misses)) {
    ensure(siteIds.has(id), `Unknown site id in misses: ${id}`);
  }
  for (const id of Object.keys(reviews)) {
    ensure(siteIds.has(id), `Unknown site id in reviews: ${id}`);
  }
  for (const id of Object.keys(matches)) {
    ensure(!misses[id], `Site id appears in both matches and misses: ${id}`);
    ensure(!reviews[id], `Site id appears in both matches and reviews: ${id}`);
  }
  for (const id of Object.keys(misses)) {
    ensure(!reviews[id], `Site id appears in both misses and reviews: ${id}`);
  }
}

function buildCompletedIdSet(
  matches: MatchesBySiteId,
  misses: MissesBySiteId,
  reviews: ReviewsBySiteId,
  retryApiErrors: boolean
): Set<string> {
  const completedIds = new Set([
    ...Object.keys(matches),
    ...Object.keys(misses),
    ...Object.keys(reviews),
  ]);
  if (!retryApiErrors) {
    return completedIds;
  }
  for (const [id, miss] of Object.entries(misses)) {
    if (miss.reason === "api_error") {
      completedIds.delete(id);
    }
  }
  return completedIds;
}

function runInvariantChecks(): void {
  ensure(
    normalizeName("ACME & Co. Superfund Site") === "acme",
    "normalizeName"
  );
  ensure(round(1.234_56) === 1.235, "round");

  const zeroDistance = haversineMiles(40, -73, 40, -73);
  ensure(Math.abs(zeroDistance) < ALMOST_ZERO, "zero distance");

  const tenMileLatDelta = 10 / TEN_MILES_LAT_DIVISOR;
  const nearTenMiles = haversineMiles(0, 0, tenMileLatDelta, 0);
  ensure(nearTenMiles > TEN_MILES_MIN, "ten mile lower bound");
  ensure(nearTenMiles < TEN_MILES_MAX, "ten mile upper bound");

  const sampleSite: Site = {
    id: "TEST",
    name: "Example Chemical Landfill",
    semsId: "1",
    stateName: "Test",
    stateCode: "TS",
    city: "Example",
    county: "Example",
    npl: "listed",
    dateProposed: "",
    dateListed: "",
    dateCompleted: "",
    dateNOID: "",
    dateDeleted: "",
    hasPartialDeletion: false,
    lng: -73,
    lat: 40,
  };

  const accepted = evaluateCandidate(sampleSite, {
    id: "abc",
    displayName: { text: "Example Chemical Superfund Site" },
    location: { latitude: 40.01, longitude: -73.01 },
    googleMapsUri: "https://maps.google.com",
    types: ["point_of_interest", "establishment"],
  });
  ensure(accepted.accepted, "accept close superfund match");

  const noHazard = evaluateCandidate(sampleSite, {
    id: "nohaz",
    displayName: { text: "Example Chemical" },
    location: { latitude: 40.01, longitude: -73.01 },
    googleMapsUri: "https://maps.google.com",
    types: ["point_of_interest", "establishment"],
  });
  ensure(noHazard.rejectReason === "not_hazard_listing", "reject non-hazard");

  const wrongName = evaluateCandidate(sampleSite, {
    id: "wrong",
    displayName: { text: "Random Pizza Superfund Site" },
    location: { latitude: 40.01, longitude: -73.01 },
    googleMapsUri: "https://maps.google.com",
    types: ["point_of_interest", "establishment"],
  });
  ensure(wrongName.rejectReason === "name_mismatch", "reject wrong name");
}

function pickBetterMiss(
  current: SiteMissRecord | undefined,
  candidate: SiteMissRecord
): SiteMissRecord {
  if (!current) {
    return candidate;
  }
  const currentScore = current.topCandidate?.matchScore ?? -1;
  const candidateScore = candidate.topCandidate?.matchScore ?? -1;
  if (candidateScore > currentScore) {
    return candidate;
  }
  return current;
}

function pickBetterReview(
  current: SiteReviewRecord | undefined,
  candidate: SiteReviewRecord
): SiteReviewRecord {
  if (!current) {
    return candidate;
  }
  if (candidate.candidate.matchScore > current.candidate.matchScore) {
    return candidate;
  }
  return current;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: fallback-query orchestration is intentionally explicit.
async function processSingleSite(
  site: Site,
  apiKey: string
): Promise<ProcessResult> {
  const queries = buildFallbackQueries(site);
  let sawNonApiResponse = false;
  let apiErrorDetail: { statusCode?: number; error?: string } | undefined;
  let bestMiss: SiteMissRecord | undefined;
  let bestReview: SiteReviewRecord | undefined;

  for (const query of queries) {
    let result: SearchResult;
    try {
      result = await searchPlaces(site, query, apiKey);
    } catch (error) {
      const detail =
        error instanceof Error ? error.message : "Unknown request failure";
      apiErrorDetail = { error: detail };
      continue;
    }

    if (result.statusCode >= HTTP_BAD_REQUEST_MIN) {
      apiErrorDetail = {
        statusCode: result.statusCode,
        error: result.errorText,
      };
      continue;
    }

    sawNonApiResponse = true;
    if (result.places.length === 0) {
      const miss: SiteMissRecord = {
        reason: "no_results",
        sourceQuery: query,
        statusCode: result.statusCode,
      };
      bestMiss = pickBetterMiss(bestMiss, miss);
      continue;
    }

    const selection = chooseBestCandidate(site, result.places, query);
    if (selection.metadata) {
      return {
        kind: "match",
        siteId: site.id,
        metadata: selection.metadata,
      };
    }

    if (selection.review) {
      bestReview = pickBetterReview(bestReview, selection.review);
      continue;
    }

    const miss: SiteMissRecord = {
      reason: selection.missReason ?? "name_mismatch",
      sourceQuery: query,
      statusCode: result.statusCode,
      topCandidate: selection.topCandidate,
    };
    bestMiss = pickBetterMiss(bestMiss, miss);
  }

  if (bestReview) {
    return {
      kind: "review",
      siteId: site.id,
      record: bestReview,
    };
  }

  if (bestMiss) {
    return {
      kind: "miss",
      siteId: site.id,
      record: bestMiss,
    };
  }

  if (apiErrorDetail && !sawNonApiResponse) {
    return {
      kind: "miss",
      siteId: site.id,
      record: {
        reason: "api_error",
        sourceQuery: buildPrimaryQuery(site),
        statusCode: apiErrorDetail.statusCode,
        error: apiErrorDetail.error,
      },
    };
  }

  return {
    kind: "miss",
    siteId: site.id,
    record: {
      reason: "no_results",
      sourceQuery: buildPrimaryQuery(site),
    },
  };
}

function applyProcessResult(
  result: ProcessResult,
  matches: MatchesBySiteId,
  misses: MissesBySiteId,
  reviews: ReviewsBySiteId
): void {
  if (result.kind === "match") {
    matches[result.siteId] = result.metadata;
    delete misses[result.siteId];
    delete reviews[result.siteId];
    return;
  }
  if (result.kind === "review") {
    reviews[result.siteId] = result.record;
    delete misses[result.siteId];
    delete matches[result.siteId];
    return;
  }
  misses[result.siteId] = result.record;
  delete matches[result.siteId];
  delete reviews[result.siteId];
}

type PoolOptions = {
  sites: Site[];
  concurrency: number;
  handler: (site: Site) => Promise<void>;
  progressOffset: number;
  progressTotal: number;
};

async function runPool(options: PoolOptions): Promise<void> {
  const { sites, concurrency, handler, progressOffset, progressTotal } =
    options;
  let processed = 0;
  const workers = new Set<Promise<void>>();

  for (const site of sites) {
    const task = handler(site).finally(() => {
      processed += 1;
      const globalProcessed = progressOffset + processed;
      if (
        globalProcessed % PROGRESS_LOG_INTERVAL === 0 ||
        globalProcessed === progressTotal
      ) {
        log(`Processed ${globalProcessed}/${progressTotal}`);
      }
      workers.delete(task);
    });

    workers.add(task);
    if (workers.size >= concurrency) {
      await Promise.race(workers);
    }
  }

  await Promise.all(workers);
}

async function saveOutputs(
  matches: MatchesBySiteId,
  misses: MissesBySiteId,
  reviews: ReviewsBySiteId
): Promise<void> {
  const sortedMatches = sortObjectByKeys(matches);
  const sortedMisses = sortObjectByKeys(misses);
  const sortedReviews = sortObjectByKeys(reviews);

  await writeFile(MATCHES_PATH, `${JSON.stringify(sortedMatches, null, 2)}\n`);
  await writeFile(MISSES_PATH, `${JSON.stringify(sortedMisses, null, 2)}\n`);
  await writeFile(REVIEW_PATH, `${JSON.stringify(sortedReviews, null, 2)}\n`);

  log(
    `Done. Matches: ${Object.keys(sortedMatches).length}, Misses: ${Object.keys(sortedMisses).length}, Reviews: ${Object.keys(sortedReviews).length}`
  );
  log(`Wrote ${MATCHES_PATH}`);
  log(`Wrote ${MISSES_PATH}`);
  log(`Wrote ${REVIEW_PATH}`);
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: top-level pipeline wiring is intentionally linear.
async function main(): Promise<void> {
  runInvariantChecks();

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GOOGLE_MAPS_API_KEY");
  }

  const options = parseArgs(process.argv.slice(ARGS_START_INDEX));
  const allSites = SITES as Site[];
  const scopedSites = filterSites(allSites, options);

  const matches = await loadJsonRecord<SiteGoogleMapsMetadata>(
    MATCHES_PATH,
    options.overwrite
  );
  const misses = await loadJsonRecord<SiteMissRecord>(
    MISSES_PATH,
    options.overwrite
  );
  const reviews = await loadJsonRecord<SiteReviewRecord>(
    REVIEW_PATH,
    options.overwrite
  );

  const completedIds = buildCompletedIdSet(
    matches,
    misses,
    reviews,
    options.retryApiErrors
  );

  const pendingSites: Site[] = [];
  for (const site of scopedSites) {
    if (!options.overwrite && completedIds.has(site.id)) {
      continue;
    }
    pendingSites.push(site);
  }

  log(
    `Processing ${pendingSites.length} sites (scope=${scopedSites.length}, overwrite=${options.overwrite ? "true" : "false"}, retryApiErrors=${options.retryApiErrors ? "true" : "false"}, concurrency=${options.concurrency}, requireSuperfundSignal=${REQUIRE_SUPERFUND_SIGNAL ? "true" : "false"})`
  );

  await runPool({
    sites: pendingSites,
    concurrency: options.concurrency,
    handler: async (site) => {
      const result = await processSingleSite(site, apiKey);
      applyProcessResult(result, matches, misses, reviews);
    },
    progressOffset: 0,
    progressTotal: pendingSites.length,
  });

  if (options.retryApiErrors) {
    const retrySites: Site[] = [];
    for (const site of pendingSites) {
      const miss = misses[site.id];
      if (miss?.reason === "api_error") {
        retrySites.push(site);
      }
    }

    if (retrySites.length > 0) {
      log(
        `Retrying ${retrySites.length} api_error sites (concurrency=${API_RETRY_CONCURRENCY})`
      );
      await runPool({
        sites: retrySites,
        concurrency: API_RETRY_CONCURRENCY,
        handler: async (site) => {
          const result = await processSingleSite(site, apiKey);
          applyProcessResult(result, matches, misses, reviews);
        },
        progressOffset: pendingSites.length - retrySites.length,
        progressTotal: pendingSites.length,
      });
    }
  }

  validateOutputs(matches, misses, reviews, allSites);
  await saveOutputs(matches, misses, reviews);
}

await main();
