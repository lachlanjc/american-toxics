import { type Site } from "@/lib/data/site";
import SITES from "@/lib/data/sites.json" assert { type: "json" };
import { Defuddle } from "defuddle/node";
import { JSDOM } from "jsdom";

async function parseArticle(url: string): Promise<string> {
  // return new Promise(async (resolve, reject) => {
  // try {
  const dom = await JSDOM.fromURL(url);
  // const mainColumn = dom.window.document.body.querySelector(
  //   ".node.view-mode-full",
  // ).firstChild;
  const result = await Defuddle(dom, url, { markdown: true });
  const content = result.content ?? "";
  const sections = content.split("\n\n---");
  const body = sections.slice(1, sections.length).join("");

  return body;
  //   } catch (e) {
  //     console.log(`error parsing ${url}, error: ${e}`);
  //     reject("not available");
  //   }
  // });
}

const sitesPreview = SITES.filter((site) => site.state === "Pennsylvania");

for (const site of sitesPreview) {
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
