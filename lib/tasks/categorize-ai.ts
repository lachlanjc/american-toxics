import { supabase } from "../supabaseClient";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { siteTypes } from "./categorize";
import { SupabaseSite } from "../data/site";

const siteTypeKeys = Object.keys(siteTypes);

async function classifySite(
  site: Pick<SupabaseSite, "id" | "name" | "summary">,
) {
  const system = `<role>You are an expert toxic Superfund site classifier.</role>
    <instructions>Classify the following Superfund site into one of the following categories: \`${siteTypeKeys.filter((k) => k !== "unknown").join("` | `")}\`. If the site name does not fit any of the categories, return \`other\`.</instructions>
    <important_rule>ONLY return the category name, no Markdown, no quotes, no explanation, JUST the name.</important_rule>
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
  // category is null, other, or unknown
  .or("category.is.null, category.eq.unknown, category.eq.other");

console.log(allSites?.length, "sites ready for categorization");

for (const site of allSites || []) {
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
    console.log(site.summary);
    console.log("");
  }
}
