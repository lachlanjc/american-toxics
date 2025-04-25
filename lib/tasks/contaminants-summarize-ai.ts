import { supabase } from "../supabaseClient";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import PQueue from "p-queue";
// Getting weird issue using import: https://gitlab.com/autokent/pdf-parse/-/issues/24#note_1333963300
const pdfParse = require("pdf-parse");

// Define the shape of a contaminants row including fields to process
type ContaminantRow = {
  id: string;
  name: string;
  summary: string | null;
  wikipediaUrl: string | null;
};

// Limit concurrent processing to avoid overwhelming APIs
const queue = new PQueue({ concurrency: 2 });

let usage = {
  input: 0,
  output: 0,
};

/**
 * Download a PDF from a URL and return its Buffer
 */
async function downloadPdf(url: string): Promise<null | Buffer> {
  const res = await fetch(url);
  if (!res.ok) {
    return null;
  }
  const arrayBuffer = await res.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

/**
 * Extract text content from a PDF Buffer using pdf-parse
 */
async function extractText(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer as any);
  return data.text;
}

/**
 * Summarize contaminant text using OpenAI GPT-4.1 via AI SDK
 */
async function summarizeContaminant(text: string): Promise<string> {
  const system = `<role>You are an expert toxicologist summarizes technical EPA documents about environmental contaminants at toxic Superfund sites for a general audience in plain, concise language.</role>
<tone>You speak like a caring, knowledgeable neighbor: serious and not casual, very understandable with everyday language, never overly technical. You care, and make others care, deeply.</tone>
<task>Summarize the contaminant: what it is, its main risks to humans/the environment, and notable causes of its contamination. Use 3-ish concise sentences,</task>
    `;
  const prompt = `<context>\n${text}\n</context>`;
  const response = await generateText({
    model: openai("gpt-4.1"),
    system,
    prompt,
  });
  usage.input += response.usage.promptTokens;
  usage.output += response.usage.completionTokens;
  return response.text.trim();
}

/**
 * Fetch Wikipedia page URL and page text (extract) via REST summary API
 */
async function fetchWikiPage(
  title: string,
): Promise<{ pageUrl: string | null; pageText: string | null }> {
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    title,
  )}`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: any = await res.json();
    const pageUrl: string | null = json.content_urls?.desktop?.page ?? null;
    const pageText: string | null = json.extract ?? null;
    return { pageUrl, pageText };
  } catch (err: any) {
    // console.error(
    //   `Error fetching Wikipedia page for ${title}:`,
    //   err.message || err,
    // );
    return { pageUrl: null, pageText: null };
  }
}

/**
 * Process one contaminant: download PDF, extract text, summarize, fetch image, and update Supabase
 */
async function processContaminant(row: ContaminantRow): Promise<void> {
  console.log(`Processing ${row.id} (${row.name})`);
  try {
    // Fetch Wikipedia summary
    let wiki = await fetchWikiPage(row.name);
    if (!wiki.pageUrl && row.name.includes("(")) {
      console.log("using before parens");
      wiki = await fetchWikiPage(row.name.split(" (")[0]);
    }
    if (!wiki.pageUrl && row.name.includes(")")) {
      console.log("using parens");
      // get parentheses contents only
      wiki = await fetchWikiPage(row.name.match(/\(([^)]+)\)/)?.[1] || "");
    }
    let context = wiki.pageText || "";
    if (!context) {
      console.error(`No Wikipedia page found for ${row.name}`);
      return;
    }
    // let epaPdfUrl = `https://www.epa.gov/sites/default/files/2016-09/documents/${row.id}.pdf`;
    const pdfBuffer = await downloadPdf(row.epaPdfUrl);
    if (!pdfBuffer) {
      console.error(`Failed to download context PDF for ${row.id}`);
    } else {
      const pdfText = await extractText(pdfBuffer);
      console.log(`Extracted ${pdfText.length} characters from PDF`);
      context = `<source_epa>
${pdfText}
</source_epa>
<source_wikipedia>
${wiki.pageText}
</source_wikipedia>`;
    }
    const summary = await summarizeContaminant(context);
    // Prepare update payload for contaminant
    const updateData: any = { summary };
    if (wiki.pageUrl) updateData.wikipediaUrl = wiki.pageUrl;
    // if (epaPdfUrl) updateData.epaPdfUrl = epaPdfUrl;
    // Update contaminant row with summary and wikipediaUrl
    const { error } = await supabase
      .from("contaminants")
      .update(updateData)
      .eq("id", row.id);
    if (error) {
      console.error(`Error updating ${row.id}:`, error.message || error);
    } else {
      console.log(`Updated ${row.id}`);
    }
    // brief pause between tasks to respect rate limits
    await new Promise((r) => setTimeout(r, 1000));
  } catch (err: any) {
    console.error(`Failed processing ${row.id}:`, err.message || err);
  }
}

// Main execution: fetch all contaminants and enqueue those missing summary or Wikipedia URL
const { data, error } = await supabase
  .from("contaminants")
  .select("id,name,summary,wikipediaUrl,epaPdfUrl")
  .not("epaPdfUrl", "is", null)
  .is("summary", null);
// .limit(1);
if (error) {
  console.error("Error fetching contaminants:", error.message || error);
  process.exit(1);
}
const rows: ContaminantRow[] = data || [];
const toProcess = rows.filter((r) => !r.summary || !r.wikipediaUrl);
console.log(`Found ${toProcess.length} contaminants to summarize.`);
for (const row of toProcess) {
  queue.add(() => processContaminant(row));
}
await queue.onIdle();
console.log("All done.");
console.log("Contaminants processed:", toProcess.length);
/*
Input:
$2.00 / 1M tokens
Cached input:
$0.50 / 1M tokens
Output:
$8.00 / 1M tokens
*/
const priceEstimate = usage.input * 0.002 + usage.output * 0.008;
console.log("Price estimate: $", priceEstimate.toFixed(2));
