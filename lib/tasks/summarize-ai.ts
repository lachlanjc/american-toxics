import { supabase } from "../supabaseClient";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { SupabaseSite } from "../data/site";

async function recordIssue(id: string) {
  const filePath = Bun.file("lib/data/sites-missing.txt");
  let content = await filePath.text();
  if (content.includes(id)) {
    console.log("Already recorded issue for site:", id);
    return;
  } else {
    content += `${id}\n`;
    await Bun.write(filePath, content);
    console.log("Recorded issue for site:", id);
  }
}

async function describeSite(site: Pick<SupabaseSite, "id" | "name">) {
  const filePath = Bun.file(`lib/data/txt/${site.id}.txt`);
  let context = "";
  try {
    context = await filePath.text();
  } catch (error) {
    recordIssue(site.id);
    return null;
  }
  if (!context || context.startsWith("Oops")) {
    console.error("No context found for site:", site.id, site.name);
    recordIssue(site.id);
    return null;
  }

  const system = `<role>You are knowledgeable about toxic waste Superfund sites in the US. You learn from technical documents written by EPA scientists to describe the site to average people in casual, plain language, in a concise manner.</role>

<goal>Summarize what happened at this site in 3 concise sentences, including (most importantly) who/what caused contamination and (in a few words) the current state. Your goal is to make people care about the site.</goal>

<instructions>
- You speak like a caring, knowledgeable neighbor: serious and not casual, very understandable with everyday language, never overly technical
- Spell out acronyms on their first usage, except for EPA, PCBs, and PFAS (which are commonly known)
- NEVER reference complex chemical formulas. Instead, describe or group substances, and put names italicized in parentheses if they’re critical for everyone to know. For example, \`industrial cleaning agents (*TCE*)\`, \`forever chemicals (*PFAS*)\`, \`*PCBs*\`, \`heavy metals (*mercury*, *lead*)\`
- Don’t include the name of the site and location, but include years wherever relevant
- Say “EPA” instead of “they”, and don’t spell it out
- Do not mention Five-Year Reviews or National Priorities List
- **Bold one short key phrase**
- Format every acronym, chemical name, and scientific concept (not commonly known) *italicized*, even inside bolding. If you mention the same concept repeatedly, no need to italicize it after the first time
- never use underscores
- avoid filler words
- feel free to use & instead of "and" when listing two or more things
- keep the legacy section just a few words & factual, don’t say the site is a “reminder” or “lesson”
</instructions>

<final_instruction>
The most important rule is, pull information from the context.
</final_instruction>`;
  const prompt = `<context>
# ${site.id} ${site.name}

${context}
</context>`;
  const response = await generateText({
    model: openai("gpt-4.1"),
    system,
    prompt,
  });
  return response.text.trim();
}

// FOR PRODUCTION
const { data: allSites } = await supabase
  .from("sites")
  .select("id, name")
  // .eq("category", "che")
  .is("summary", null);
// .limit(5);

for (const site of allSites || []) {
  const summary = await describeSite(site);
  console.log("Summarized:", site.id, site.name);
  console.log(summary);
  if (!summary) {
    console.error("No summary found for site:", site.id, site.name);
    continue;
  }
  const { error } = await supabase
    .from("sites")
    .update({ summary })
    .eq("id", site.id);
  if (error) {
    console.error("Error updating site:", site.id, site.name, error);
  } else {
    console.log("Updated site:", site.id, site.name);
  }
  console.log("");
}
