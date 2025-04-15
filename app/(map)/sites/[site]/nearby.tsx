import {
  School,
  College,
  PlaceOfWorship,
  Park,
  Soccer,
  Baseball,
  Basketball,
  Waterfall,
  FitnessCentre,
  Natural,
  Danger,
  Prison,
  Wheelchair,
  Marker,
  Library,
  Doctor,
} from "@alpaca-travel/react-maki-icons";
import { MAPBOX_TOKEN } from "@/lib/util/mapbox";
import { getNearbySites, Site } from "@/lib/data/api";
import { SiteList } from "../list";
import { WellRoot, WellTitle } from "@/lib/ui/well";

export const icons = {
  school: School,
  college: College,
  "place-of-worship": PlaceOfWorship,
  park: Park,
  soccer: Soccer,
  baseball: Baseball,
  basketball: Basketball,
  waterfall: Waterfall,
  natural: Natural,
  "fitness-centre": FitnessCentre,
  prison: Prison,
  doctor: Doctor,
  marker: Marker,
  wheelchair: Wheelchair,
  danger: Danger,
  library: Library,
};

function metersToMiles(meters: number) {
  const miles = meters * 0.000621371;
  return miles;
}

interface MapboxFeature {
  type: string;
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    mapbox_id: string;
    name: string;
    distance: number;
    category: string;
    poi_category: Array<string>;
    poi_category_ids: Array<string>;
    maki: string;
  };
}

const categories = [
  "education",
  "church",
  "assisted_living_facility",
  "outdoors",
  // "place_of_worship",
  // "health_services",
  "hospital",
  "medical_practice",
  "doctors_office",
  // "medical_clinic",
  "care_services",
  "childcare",
  "prison",
  "fitness_centre",
] as const;
const categoriesString = categories.join(",");
const highlightedCategories: Record<
  keyof typeof categories,
  {
    name: string;
    namePlural?: string;
    icon: keyof typeof icons;
    search: Array<string>;
  }
> = {
  // @ts-expect-error it literally is
  education: {
    name: "school",
    icon: "college",
    search: [
      "daycare",
      "preschool",
      "montessori",
      "kinder:kindergarten",
      "elementary",
      "kumon:tutor",
      "middle",
      "high",
      "college",
      "university",
      "music",
    ],
  },
  library: {
    name: "library",
    namePlural: "libraries",
    icon: "library",
    search: ["public", "university"],
  },
  health_services: {
    name: "doctor",
    namePlural: "doctors",
    icon: "doctor",
    search: ["pediatric", "va:veterans", "senior:senior care", "hospital"],
  },
  outdoors: {
    name: "park",
    icon: "park",
    search: ["playground", "basketball", "soccer", "trail", "campground"],
  },
  church: {
    name: "church",
    icon: "place-of-worship",
    namePlural: "churches",
    search: ["synagogue"],
  },
  assisted_living_facility: {
    name: "assisted living facility",
    namePlural: "assisted living facilities",
    icon: "wheelchair",
    search: [],
  },
  fitness_centre: { name: "gym", icon: "fitness-centre", search: [] },
  prison: { name: "prison", icon: "prison", search: ["state", "federal"] },
} as const;

function MakiIcon({
  icon,
  className,
}: {
  icon: string | keyof typeof icons;
  className?: string;
}) {
  // @ts-expect-error icon might be generic string
  const Icon = icons[icon] ?? Marker;
  return <Icon className={className} />;
}

const listFormatter = new Intl.ListFormat("en-US", {
  style: "short",
  type: "conjunction",
});

export async function Nearby({ site }: { site: Site }) {
  const url = `https://api.mapbox.com/search/searchbox/v1/category/${categoriesString}?proximity=${site.lng},${site.lat}&language=en&poi_category_exclusions=medical_laboratory,alternative_healthcare&limit=12&access_token=${MAPBOX_TOKEN}`;
  // console.log(url);
  const mapbox = await fetch(url).then((res) => res.json());
  let nearbyFeatures: Array<MapboxFeature> = mapbox.features ?? [];
  // .filter((feat: MapboxFeature) => feat.properties?.distance <= 1609);
  // Everything is over a mile away
  if (nearbyFeatures.every((feat) => feat.properties?.distance > 1609)) {
    nearbyFeatures = [];
  }
  // Dedupe by name
  nearbyFeatures = nearbyFeatures.filter(
    (feat, index) =>
      index ===
      nearbyFeatures.findIndex(
        (f) => f.properties.name === feat.properties.name,
      ),
  );

  // console.log(url, mapbox.features);
  const nearbySites = getNearbySites(site);
  if (nearbyFeatures.length === 0 && nearbySites.length === 0) {
    return null;
  }

  const nearbyFeatureGroups: Array<{
    category: string;
    features: Array<MapboxFeature>;
    subcategories: Array<[number, string]>;
  }> = Object.entries(highlightedCategories)
    .map(([category, { search }]) => {
      let categoryPOIs = nearbyFeatures.filter((feat) =>
        feat.properties.poi_category_ids.includes(category),
      );
      if (category === "education") {
        categoryPOIs = categoryPOIs.filter(
          (feat) =>
            !feat.properties.poi_category_ids.includes("library") &&
            !feat.properties.name.toLowerCase().includes("parking"),
        );
      }
      if (categoryPOIs.length === 0) return null;
      const subcategories = search
        .map((termAndLabel) => {
          let [term, label] = termAndLabel.split(":"); // eslint-disbale-line
          label ??= term;
          const count = categoryPOIs.filter(
            (poi) =>
              poi.properties.name.toLowerCase().includes(term) ||
              poi.properties.poi_category.includes(term) ||
              poi.properties.poi_category_ids.includes(term),
          ).length;
          return [count, label] as [number, string];
        })
        .filter((value) => value[0] > 0)
        .sort(([a], [b]) => b - a);
      return {
        category,
        // icon: categoryPOIs[0].properties.maki,
        features: categoryPOIs,
        subcategories,
      };
    })
    .filter((group) => group !== null);

  return (
    <WellRoot className="mt-4 flex flex-col gap-y-2">
      <WellTitle>Within 1 mile</WellTitle>
      {nearbyFeatures.length > 0 &&
        nearbyFeatureGroups.map((group) => {
          const count = group.features.length;
          const category =
            highlightedCategories[
              group.category as keyof typeof highlightedCategories
            ];
          return (
            <PlaceGroup
              key={group.category}
              icon={category.icon}
              title={
                <>
                  <span className="font-sans text-base">
                    {count === 1 ? "A" : count}{" "}
                    <strong className="font-medium">
                      {count === 1
                        ? category.name
                        : category.namePlural || `${category.name}s`}
                    </strong>
                  </span>
                  {group.subcategories.length > 0 && (
                    <small className="font-mono text-xs text-neutral-600 ml-1">
                      (
                      {listFormatter.format(
                        group.subcategories.map(([count, name]) =>
                          count === 1
                            ? name
                            : `${count} ${name.replace("ty", "tie")}s`,
                        ),
                      )}
                      )
                    </small>
                  )}
                </>
              }
            >
              <MapboxFeatureList features={group.features} />
            </PlaceGroup>
          );
        })}
      {nearbySites.length > 0 && (
        <PlaceGroup
          icon="danger"
          title={
            <span className="font-sans text-base">
              {nearbySites.length === 1 ? "Another" : nearbySites.length}{" "}
              <strong className="font-medium">
                {nearbySites.length === 1
                  ? "Superfund site"
                  : "more Superfund sites"}
              </strong>
            </span>
          }
        >
          <SiteList sites={nearbySites} className="ml-1" />
        </PlaceGroup>
      )}
    </WellRoot>
  );
}

function PlaceGroup({
  icon,
  title,
  children,
}: React.PropsWithChildren<{
  icon: keyof typeof icons;
  title: React.ReactNode;
}>) {
  return (
    <details>
      <summary className="flex gap-2 items-center cursor-pointer">
        <MakiIcon
          icon={icon}
          className="w-4 h-4 fill-neutral-400 self-center"
        />
        <div>{title}</div>
        <small
          className="font-mono text-neutral-500 text-sm ml-auto select-none in-open:-rotate-45 transition-transform"
          aria-hidden
        >
          +
        </small>
      </summary>
      {children}
    </details>
  );
}

function MapboxFeatureList({ features }: { features: Array<MapboxFeature> }) {
  return (
    <ol className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 pl-6 items-baseline">
      {features.map((feature) => {
        const dist = metersToMiles(feature.properties.distance);
        return (
          <li
            className="contents"
            role="listitem"
            key={feature.properties.mapbox_id}
          >
            <span className="w-full font-sans text-base truncate">
              {feature.properties.name}
            </span>
            <small
              className={`text-right text-xs align-top whitespace-pre ${dist < 0.15 ? "text-primary font-semibold" : "text-neutral-600"}`}
            >
              {dist.toLocaleString("en-US", { maximumFractionDigits: 2 })} mi
            </small>
          </li>
        );
      })}
    </ol>
  );
}
