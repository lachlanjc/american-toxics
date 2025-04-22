import { supabase } from "../supabaseClient";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { SupabaseSite } from "../data/site";
import PQueue from "p-queue";

const queue = new PQueue({ concurrency: 10 });

async function classifySite(
  site: Pick<SupabaseSite, "id" | "name" | "summary">,
) {
  const system = `<role>You are an expert toxic Superfund site classifier.</role>
    <instructions>Classify the following Superfund site into one of the provided categories. If the site does not fit any of the categories, return \`other\`.</instructions>
    <important_rule>ONLY return the category name, no Markdown, no quotes, no explanation, no category description, JUST the name.</important_rule>
    <valid_values>
    | value | description |
    | --- | --- |
    | chemical | Chemical manufacturing and processing sites |
    | dryclean | Dry cleaning clothing sites, laundromats (NOT industrial cleaning) |
    | fuel | Oil refineries, pipelines, and storage tanks |
    | manufacturing | Manufacturing (including textile) and industrial sites |
    | metal | Metal smelting, foundries, and processing sites |
    | military | Military bases and munitions sites |
    | mining | Mining and smelting sites, including tailings, smelter waste |
    | tech | Electronics manufacturing and semiconductor sites |
    | waste | Landfills, dumps, recycling, junkyards, waste disposal sites |
    | water | Water contamination sites, wastewater treatment, and |
    | wood | Logging, wood treatment, lumber processing mills |
    | other | Other |
    </valid_values>
    <example>
    <input>
    # AZ0000309013 Iron King Mine - Humboldt Smelter
    mining and smelting companies left behind huge piles of toxic mine tailings and smelter waste loaded with heavy metals like arsenic
    </input>
    <output>mining</output>
    </example>`;
  const prompt = `<context># ${site.id} ${site.name}
${site.summary}
</context>`;
  const response = await generateText({
    model: openai("gpt-4.1-nano"),
    system,
    prompt,
  });
  return response.text.trim().toLowerCase();
}

// FOR PRODUCTION
const { data: allSites } = await supabase
  .from("sites")
  .select("id, name, summary")
  .not("summary", "is", null)
  .or(
    "id.eq.MAD2084093, id.eq.NMN000622185, id.eq.WASFN1002171, id.eq.MAD980731335, id.eq.WAD009248295, id.eq.PRD980763783, id.eq.OHD057243610",
  );
// .eq("category", "dryclean");
// .limit(10);
// category is null, other, or unknown
// .or("category.is.null, category.eq.unknown, category.eq.other");
// .ilike("name", "%well%");

console.log(allSites?.length, "sites ready for categorization");

async function processSite(site: SupabaseSite) {
  const category = await classifySite(site);
  // console.log("Classified:", site.id, site.name, category);
  const { error } = await supabase
    .from("sites")
    .update({ category })
    .eq("id", site.id);
  if (error) {
    console.error("Error updating site:", site.id, site.name, error);
  } else {
    console.log("Updated site:", site.id, site.name, category);
    // console.log(site.summary);
    console.log("");
  }
}

for (const site of allSites || []) {
  queue.add(() => processSite(site));
}
