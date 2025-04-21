import { supabase } from "../supabaseClient";

type Contaminants = Array<{
  name: string;
  media: string;
}>;

const { data: allSites } = await supabase
  .from("sites")
  .select("id, semsId")
  .is("contaminants", null)
  .limit(250);

for (const site of allSites || []) {
  const url = `https://data.epa.gov/dmapservice/sems.envirofacts_contaminants/fk_site_id/equals/0${site.semsId}/1:1000/json`;
  const contaminants = await fetch(url)
    .then((res) => res.json())
    .then((data: Array<Record<string, string>> = []) => {
      return data.map((cont) => ({
        name: cont.preferred_contaminant_name,
        media: cont.media_name,
      }));
    })
    .catch((err) => {
      console.error(`Error fetching contaminants for ${site.id}: ${err}`, url);
      return [];
    });
  if (contaminants.length === 0) {
    console.log(`No contaminants found for`, site.id, url);
    // continue;
  }
  const { error } = await supabase
    .from("sites")
    .update({ contaminants })
    .eq("id", site.id);
  if (error) {
    console.error("Error fetching site:", site.id, error);
  } else {
    console.log("Updated site:", site.id, site.semsId, contaminants.length);
  }
}
