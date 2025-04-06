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

const scopedSites = SITES.filter((site) => site.state === "New Jersey");
// sort((a, b) => a.id.localeCompare(b.id))

for (const site of scopedSites) {
  const url = `https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.cleanup&id=0${site.semsId}`;
  console.log(`Downloading ${site.id} ${site.name}... ${url}`);
  parseArticle(url)
    .then((content) => {
      Bun.write(`./lib/data/txt/${site.id}.txt`, content);
      console.log(`Parsed content for ${site.id} ${site.name}`);
    })
    .catch((error) => {
      console.error(`Error parsing ${site.id} ${site.name}: ${error}`);
    });
}
