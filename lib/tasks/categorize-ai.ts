import { supabase } from "../supabaseClient";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { siteTypes } from "./categorize";
import { SupabaseSite } from "../data/site";

const siteTypeKeys = Object.keys(siteTypes);

async function classifySite(site: Pick<SupabaseSite, "id" | "name">) {
  const system = `<role>You are an expert toxic Superfund site classifier.</role>
    <instructions>Classify the following Superfund site into one of the following categories: \`${siteTypeKeys.join("` | `")}\`. If the site name does not fit any of the categories, return \`other\`.</instructions>
    <important_rule>ONLY return the category name, no Markdown, no quotes, no explanation, JUST the name.</important_rule>
    <example>
    <input>
    # Uravan Uranium Project
    Uranium and vanadium processing took place here from the 1940s until 1984, after a radium-recovery plant first started operating in 1912.
    </input>
    <output>mining</output>
    </example>`;
  const prompt = `<context># ${site.id} ${site.name}</context>`;
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
  .select("id, name")
  .eq("category", "unknown")
  .limit(50);

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
  }
}
