import { supabase } from "../supabaseClient";
import PQueue from "p-queue";

const queue = new PQueue({ concurrency: 10 });

type Contaminants = Array<{
  name: string;
  media: string;
}>;

const { data: allSites } = await supabase
  .from("sites")
  .select("id, semsId")
  .is("contaminants", null);
// .eq("contaminants", "[]");
// .eq("id", "PAD000436261");
// .limit(250);

const getUrl = (id: string) =>
  `https://data.epa.gov/dmapservice/sems.envirofacts_contaminants/fk_site_id/equals/${id}/1:1000/json`;

async function processSite(site: { id: string; semsId: string }) {
  // Try zero-padded and not, use whichever has more results
  let contaminantsRaw = await Promise.all([
    fetch(getUrl(site.semsId)).then((res) => res.json()),
    fetch(getUrl(`0${site.semsId}`)).then((res) => res.json()),
  ])
    .then((data) => {
      if (data[0].length > data[1].length) {
        return data[0];
      }
      return data[1];
    })
    .catch((err) => {
      console.error(
        `Error fetching contaminants for ${site.id}: ${err}`,
        getUrl(site.semsId),
      );
    });

  // .then((data: Array<Record<string, string>> = []) => {
  const contaminants = contaminantsRaw.map((cont: Record<string, string>) => ({
    name: cont.preferred_contaminant_name,
    media: cont.media_name,
  }));
  if (contaminants.length === 0) {
    console.log(`No contaminants found for`, site.id, getUrl(site.semsId));
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

for (const site of allSites || []) {
  queue.add(() => processSite(site));
}
