import { type Site } from "@/lib/data/site";
import SITES from "@/lib/data/sites.json" assert { type: "json" };
import { Defuddle } from "defuddle/node";
import { JSDOM } from "jsdom";
import { Glob } from "bun";

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
    const sections = content.replaceAll(/\---/g, "---").split("\n\n---");
    // Remove TOC
    let body = sections.slice(1, sections.length).join("").trim();
    // Remove various lines
    body = body
      .replaceAll("[Superfund](http://www.epa.gov/superfund)", "Superfund")
      .split("\n\n")
      .filter(
        (line) => !line.startsWith("Disclaimer") && line !== "**Background**",
      )
      .join("\n\n");
    resolve(body);
  });
}

const ids = [];

// find sites without txt files
for (const site of SITES) {
  const possibility = Bun.file(`./lib/data/txt/${site.id}.txt`);
  const exists = await possibility.exists();
  if (!exists) {
    ids.push(site.id);
  }
}

// find empty files
const txt = new Glob("./lib/data/txt/*.txt");
for await (const file of txt.scan(".")) {
  const id = file.split(".").at(-2)?.split("/").pop();
  const content = await Bun.file(file).text();
  if (!content || !content.startsWith("##")) {
    ids.push(id);
  }
}

const scopedSites: Array<Site> = ids
  .map((id) => SITES.find((site) => site.id === id))
  .filter(Boolean);
// const scopedSites = SITES.filter((site) => site.id.startsWith("WA"));
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

async function downloadSite(
  site: Site,
  leadingZero: boolean = true,
): Promise<void> {
  const url = `https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.cleanup&id=${leadingZero ? `0${site.semsId}` : site.semsId}`;
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
    downloadSite(site, false);
  }
}

await Promise.all(scopedSites.map(downloadSite));
// for (const site of scopedSites) {
//   await downloadSite(site);
// }

console.log(`REPORT
------
Total: ${stats.total}
Empty: ${stats.empty.length}
Success: ${stats.success.length}
Failure: ${stats.failure.length}
---`);

Bun.write("./lib/data/txt.json", JSON.stringify(stats, null, 2));
