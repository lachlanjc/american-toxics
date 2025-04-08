import {
  School,
  College,
  ReligiousBuddhist,
  ReligiousChristian,
  ReligiousJewish,
  ReligiousMuslim,
  ReligiousShinto,
  Park,
  Soccer,
  Baseball,
  Basketball,
  Waterfall,
  Marker,
} from "@alpaca-travel/react-maki-icons";
import { MAPBOX_TOKEN } from "@/lib/util/mapbox";
import { getNearbySites, Site } from "@/lib/data/api";
import { SiteList } from "../list";
import { WellRoot, WellTitle, WellDivider } from "@/lib/ui/well";

export const icons = {
  school: School,
  college: College,
  "religious-christian": ReligiousChristian,
  "religious-buddhist": ReligiousBuddhist,
  "religious-jewish": ReligiousJewish,
  "religious-muslim": ReligiousMuslim,
  "religious-shinto": ReligiousShinto,
  park: Park,
  soccer: Soccer,
  baseball: Baseball,
  basketball: Basketball,
  waterfall: Waterfall,
  marker: Marker,
};

function metersToMiles(meters: number) {
  const miles = meters * 0.000621371;
  return miles;
}

interface MapboxFeature {
  type: string;
  properties: {
    mapbox_id: string;
    name: string;
    distance: number;
    category: string;
    maki: string;
  };
}

export async function Nearby({ site }: { site: Site }) {
  const url = `https://api.mapbox.com/search/searchbox/v1/category/education,church,assisted_living_facility,park,field,waterfall,campground,outdoors,place_of_worship?proximity=${site.lng},${site.lat}&language=en&poi_category_exclusions=medical_laboratory&access_token=${MAPBOX_TOKEN}`;
  const mapbox = await fetch(url).then((res) => res.json());
  let nearbyFeatures: Array<MapboxFeature> = (mapbox.features ?? []).filter(
    (feat: MapboxFeature) => feat.properties?.distance <= 1609,
  );
  if (nearbyFeatures.every((feat) => feat.properties?.distance > 750)) {
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

  return (
    <WellRoot className="mt-4">
      <WellTitle>Nearby</WellTitle>
      {nearbyFeatures.length > 0 && (
        <table className="text-sm w-full mt-2">
          <thead className="sr-only">
            <tr>
              <th>Icon</th>
              <th className="text-left">Name</th>
              <th className="text-right">Distance</th>
            </tr>
          </thead>
          <tbody>
            {nearbyFeatures.map((feature) => {
              /* @ts-expect-error might fail */
              const Icon = icons[feature.properties.maki] ?? Marker;
              const dist = metersToMiles(feature.properties.distance);
              return (
                <tr key={feature.properties.mapbox_id}>
                  <td className="pr-1">
                    <Icon className="w-4 h-4 fill-neutral-400" />
                  </td>
                  <td>
                    <span className="py-1 font-sans text-base">
                      {feature.properties.name}
                    </span>
                  </td>
                  <td
                    className={`py-1 text-right text-xs align-top ${dist < 0.15 && site.dateDeleted.length === 0 ? "text-primary font-semibold" : "text-neutral-600"}`}
                  >
                    {dist.toLocaleString("en-US", { maximumFractionDigits: 2 })}{" "}
                    mi
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      {nearbyFeatures.length > 0 && nearbySites.length > 0 && <WellDivider />}
      {nearbySites.length > 0 && (
        <SiteList sites={nearbySites} className="-mt-2" />
      )}
    </WellRoot>
  );
}
