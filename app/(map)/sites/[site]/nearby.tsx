import { getNearbySites, Site } from "@/lib/data/api";
import { SiteList } from "../list";
import { WellRoot, WellTitle } from "@/lib/ui/well";
import SvgSchool from "@/lib/icons/School";
import SvgLibrary from "@/lib/icons/Library";
import SvgDoctor from "@/lib/icons/Doctor";
import SvgTree from "@/lib/icons/Tree";
import SvgChurch from "@/lib/icons/Church";
import SvgWheelchair from "@/lib/icons/Wheelchair";
import SvgGym from "@/lib/icons/Gym";
import SvgPrison from "@/lib/icons/Prison";
import SvgChevronDown from "@/lib/icons/ChevronDown";
import SvgWarning from "@/lib/icons/Warning";
import { IconComponent } from "@/lib/util/types";

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

const highlightedCategories: Record<
  keyof typeof categories,
  {
    name: string;
    namePlural?: string;
    icon: IconComponent;
    search: Array<string>;
  }
> = {
  // @ts-expect-error it literally is
  education: {
    name: "school",
    icon: SvgSchool,
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
    icon: SvgLibrary,
    search: ["public", "university"],
  },
  health_services: {
    name: "doctor",
    namePlural: "doctors",
    icon: SvgDoctor,
    search: ["pediatric", "va:veterans", "senior:senior care", "hospital"],
  },
  outdoors: {
    name: "park",
    icon: SvgTree,
    search: ["playground", "basketball", "soccer", "trail", "campground"],
  },
  church: {
    name: "church",
    namePlural: "churches",
    icon: SvgChurch,
    search: ["synagogue"],
  },
  assisted_living_facility: {
    name: "assisted living facility",
    namePlural: "assisted living facilities",
    icon: SvgWheelchair,
    search: [],
  },
  fitness_centre: { name: "gym", icon: SvgGym, search: [] },
  prison: { name: "prison", icon: SvgPrison, search: ["state", "federal"] },
} as const;

const listFormatter = new Intl.ListFormat("en-US", {
  style: "short",
  type: "conjunction",
});

export async function Nearby({
  site,
  nearbyFeatures = [],
}: {
  site: Site;
  nearbyFeatures: Array<MapboxFeature>;
}) {
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
          let [term, label] = termAndLabel.split(":"); // eslint-disable-line
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
    <WellRoot className="flex flex-col gap-y-1.5">
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
          icon={SvgWarning}
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
          <SiteList sites={nearbySites} className="ml-2" />
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
  icon: IconComponent;
  title: React.ReactNode;
}>) {
  const Icon = icon;
  return (
    <details>
      <summary className="flex gap-2 items-center cursor-pointer">
        <Icon
          width={20}
          height={20}
          className="fill-neutral-400 self-center"
          aria-hidden
        />
        <div>{title}</div>
        <SvgChevronDown
          width={20}
          height={20}
          className="-mr-1 ml-auto text-neutral-400 transition-transform in-open:rotate-180"
          aria-hidden
        />
      </summary>
      {children}
    </details>
  );
}

function MapboxFeatureList({ features }: { features: Array<MapboxFeature> }) {
  return (
    <ol
      className="grid grid-cols-[1fr_auto] gap-x-2 gap-y-1 pl-7 items-baseline"
      role="list"
    >
      {features.map((feature) => {
        const dist = metersToMiles(feature.properties.distance);
        return (
          <li
            className="contents"
            role="listitem"
            key={feature.properties.mapbox_id}
          >
            <span className="w-full font-sans text-base truncate text-neutral-600">
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
