import { type Site } from "@/lib/data/site";
import SITES from "@/lib/data/sites.json" assert { type: "json" };
import { Defuddle } from "defuddle/node";
import { JSDOM } from "jsdom";

async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  try {
    return await fetch(url);
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return fetchWithRetry(url, retries - 1);
    }
    throw error;
  }
}

function parseArticle(url: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const response = await fetchWithRetry(url).then((res) => res.text());
    const dom = new JSDOM(response);
    const result = await Defuddle(dom, url, { markdown: true });
    const content = result.content ?? "";
    // const id = url.split("=").at(-1);
    if (content.length === 0) {
      return reject("Empty");
    }
    if (content.startsWith("Oops!")) {
      return reject("URL invalid");
    }
    const sections = content.split("\n\n---");
    const body = sections.slice(1, sections.length).join("").trim();
    resolve(body);
  });
}

const scopedSites = SITES.filter((site) => site.id.startsWith("NJ"));
// sort((a, b) => a.id.localeCompare(b.id))

let stats: {
  total: number;
  empty: string[];
  success: string[];
  failure: string[];
} = {
  total: 0,
  empty: [],
  success: [],
  failure: [],
};

async function downloadSite(site: Site): Promise<void> {
  const url = `https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.cleanup&id=0${site.semsId}`;
  stats.total++;
  console.log(`Downloading ${site.id} ${site.name}... ${url}`);
  let content = "";
  try {
    content = await parseArticle(url);
  } catch (error) {
    console.error(`Failed to download ${site.id} ${site.name}: ${error}`);
    stats.failure.push(site.id);
  }
  if (content.length > 0) {
    Bun.write(`./lib/data/txt/${site.id}.txt`, content);
    console.log(`Parsed content for ${site.id} ${site.name}`);
    stats.success.push(site.id);
  } else {
    console.error(`No content found for ${site.id} ${site.name}`);
    stats.empty.push(site.id);
  }
}

await Promise.all(scopedSites.map(downloadSite));

console.log(`REPORT
------
Total: ${stats.total}
Empty: ${stats.empty.length}
Success: ${stats.success.length}
Failure: ${stats.failure.length}
---`);

Bun.write("./lib/data/txt.json", JSON.stringify(stats, null, 2));
