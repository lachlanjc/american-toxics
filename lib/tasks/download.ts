import { type Site } from "@/lib/data/site";
import SITES from "@/lib/data/sites.json" assert { type: "json" };
import { Readability } from "@mozilla/readability";
import jsdom, { JSDOM } from "jsdom";

async function fetchWithTimeout(url: string, options = {}, timeout = 3000) {
  // Create an AbortController
  const controller = new AbortController();
  const { signal } = controller;

  // Set a timeout to abort the fetch
  const fetchTimeout = setTimeout(() => {
    controller.abort();
  }, timeout);

  // Start the fetch request with the abort signal
  return fetch(url, { ...options, signal })
    .then((response) => {
      clearTimeout(fetchTimeout); // Clear the timeout if the fetch completes in time
      return response;
    })
    .catch((error) => {
      if (error.name === "AbortError") {
        throw new Error("Fetch request timed out");
      }
      throw error; // Re-throw other errors
    });
}

const cleanedText = (text: string) => {
  let newText = text
    .trim()
    .replace(/(\n){4,}/g, "\n\n\n")
    .replace(/\n\n/g, " ")
    .replace(/ {3,}/g, "  ")
    .replace(/\t/g, "")
    .replace(/\n+(\s*\n)*/g, "\n");

  return newText.substring(0, 20000);
};

async function parseArticle(url: string): Promise<string> {
  // return new Promise(async (resolve, reject) => {
  // try {
  // Fetch the source URL, or abort if it's been 3 seconds
  const response = await fetch(url);
  const html = await response.text();
  // if (!html) {
  //   reject("HTML content not available");
  // }
  const dom = new JSDOM(html, { url });

  // const virtualConsole = new jsdom.VirtualConsole();
  // const dom = new JSDOM(html, { virtualConsole });
  // filter for .main-column
  // const mainColumn = dom.window.document.querySelector(
  //   ".node.view-mode-full",
  // );
  // if (!mainColumn) {
  //   reject("Main text not available");
  // } else {
  //   console.log(mainColumn.textContent);
  // }

  const parsed = new Readability(dom.window.document).parse();
  let parsedContent = parsed?.textContent
    ? cleanedText(parsed.textContent)
    : "";

  return parsedContent;
  //   } catch (e) {
  //     console.log(`error parsing ${url}, error: ${e}`);
  //     reject("not available");
  //   }
  // });
}

const sites = SITES.filter((site) => site.state === "Pennsylvania").slice(
  0,
  10,
);

for (const site of SITES) {
  const url = `https://cumulis.epa.gov/supercpad/SiteProfiles/index.cfm?fuseaction=second.cleanup&id=0${site.semsId}`;
  console.log(`Downloading ${site.name}...`);
  parseArticle(url)
    .then((content) => {
      Bun.write(`./lib/data/txt/${site.id}.txt`, content);
      console.log(`Parsed content for ${site.name}`);
    })
    .catch((error) => {
      console.error(`Error parsing ${site.name}: ${error}`);
    });
}
