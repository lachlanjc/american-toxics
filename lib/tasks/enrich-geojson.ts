import { supabase } from "../supabaseClient";
// import { Site } from "../data/site";

const geojsonFile = Bun.file("./lib/data/sites.geojson");
const geojson = (await geojsonFile.json()) as unknown as {
  features: Array<Record<string, any>>;
};

const { data: allSites, error: sitesError } = await supabase
  .from("sites")
  .select("id")
  .is("acres", null);
// .limit(250);

for (const site of allSites || []) {
  const feature = geojson.features.find(
    (feature) => feature.properties?.EPA_ID === site.id,
  );
  if (!feature) {
    console.error("No feature found for site:", site.id);
    continue;
  }
  const props = feature.properties;
  // if (props.GIS_AREA_UNIT && props.GIS_AREA_UNIT !== "Acres") {
  //   throw new Error("Not acres" + props.GIS_AREA_UNIT);
  // }
  const newFields = {
    contactName: props.SITE_CONTACT_NAME,
    contactEmail: props.SITE_CONTACT_EMAIL,
    contactPhone: props.PRIMARY_TELEPHONE_NUM,
    epaUrl: props.URL_ALIAS_TXT,
    acres: props.GIS_AREA,
    geometry: feature.geometry,
  };
  const { data, error } = await supabase
    .from("sites")
    .update(newFields)
    .eq("id", site.id);
  if (error) {
    console.error("Error fetching site:", site.id, error);
  } else {
    console.log("Updated site:", site.id);
  }
}
