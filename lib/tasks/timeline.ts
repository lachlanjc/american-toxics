import { Site } from "../data/site";
import { allSites } from "../data/api";

/* ------------------------------------------- */
/* 1.  Bucket sites by listing year            */
/* ------------------------------------------- */

type Bucket = Record<number, Site[]>; // year → sites
const buckets: Bucket = {};

for (const site of allSites) {
  const raw = site.dateListed;
  if (!raw) continue; // skip if blank

  const d = new Date(String(raw));
  if (isNaN(d.getTime())) continue; // skip bad date

  (site as any).dateListed = d; // store parsed Date
  const year = d.getUTCFullYear();

  buckets[year] ??= [];
  buckets[year].push(site);
}

/* ------------------------------------------- */
/* 2.  Emit Markdown timeline                  */
/* ------------------------------------------- */

const years = Object.keys(buckets).map(Number).sort(); // 1980 → … → 2025
let mdListed = "";

for (const year of years) {
  const sites = buckets[year];
  if (!sites?.length) continue; // skip empty year

  // sort: ① date ② city ③ state
  sites.sort((a, b) => {
    const t =
      // @ts-expect-error we changed dateListed to a Date type
      (a.dateListed as Date).getTime() - (b.dateListed as Date).getTime();
    if (t !== 0) return t;
    const stateCmp = (a.stateCode ?? "").localeCompare(b.stateCode ?? "");
    if (stateCmp !== 0) return stateCmp;
    const cityCmp = (a.city ?? "").localeCompare(b.city ?? "");
    return cityCmp;
  });

  mdListed += `\n## ${year}\n\n`;
  for (const site of sites) {
    // @ts-expect-error we changed dateListed to a Date type
    const dateStr = (site.dateListed as Date).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
    });
    const state = site.stateCode ? `, ${site.stateCode}` : "";
    mdListed += `**${dateStr}:** ${site.name} _${site.city}${state}_  \n`;
  }
}

Bun.write("./lib/data/timeline-listed.md", mdListed.trimStart());
