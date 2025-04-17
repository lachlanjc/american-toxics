import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGFja2NsdWIiLCJhIjoiY2pscGI1eGdhMGRyNzN3bnZvbGY5NDBvZSJ9.Zm4Zduj94TrgU8h890M7gA";
const categories = [
  "education",
  "church",
  "assisted_living_facility",
  "outdoors",
  "hospital",
  "medical_practice",
  "doctors_office",
  "care_services",
  "childcare",
  "prison",
  "fitness_centre",
];
const categoriesString = categories.join(",");
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      status: 200,
    });
  }
  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization"),
          },
        },
      },
    );
    const { data: sites, error: fetchError } = await supabase
      .from("sites")
      .select("id, lat, lng")
      .is("mapboxNearby", null);
    if (fetchError) throw fetchError;
    console.log(`Fetched ${sites.length} sites`);
    for (const site of sites) {
      const url = `https://api.mapbox.com/search/searchbox/v1/category/${categoriesString}?proximity=${site.lng},${site.lat}&language=en&poi_category_exclusions=medical_laboratory,alternative_healthcare&limit=12&access_token=${MAPBOX_TOKEN}`;
      const mapboxResponse = await fetch(url);
      const mapboxData = await mapboxResponse.json();
      const mapboxNearby = mapboxData.features;
      console.log(`Fetched ${mapboxNearby.length} features`);
      const { error: updateError } = await supabase
        .from("sites")
        .update({
          mapboxNearby,
        })
        .eq("id", site.id);
      console.log(`Updated ${site.id} with nearby data`);
      if (updateError) throw updateError;
    }
    return new Response(
      JSON.stringify({
        message: `Updated ${sites.length} sites`,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 200,
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
        status: 400,
      },
    );
  }
});
