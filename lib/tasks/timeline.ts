import { Site } from "../data/site";
import { allSites } from "../data/api";

const fields: Array<keyof Site> = [
  "dateProposed",
  "dateListed",
  "dateCompleted",
  "dateNOID",
  "dateDeleted",
];

const FIELD_LABEL: Partial<Record<keyof Site, string>> = {
  dateProposed: "Proposed",
  dateListed: "Listed",
  dateCompleted: "Cleaning",
  dateNOID: "Cleaned",
  dateDeleted: "Completed",
};

type Bucket = Record<number, Record<string, Array<Site>>>;
const buckets: Bucket = {};

for (const site of allSites) {
  for (const field of fields) {
    const raw = site[field];
    if (!raw) continue; // blank ➜ ignore
    const d = new Date(String(raw));
    if (isNaN(d.getTime())) continue; // bad date ➜ ignore
    // @ts-expect-error update site field to Date
    site[field] = d;

    const y = d.getUTCFullYear();
    const lbl = FIELD_LABEL[field];
    if (!lbl) continue; // no label ➜ ignore

    // const { id, name, city, stateCode } = site;

    buckets[y] ??= {};
    buckets[y][lbl] ??= [];
    buckets[y][lbl].push(site);
  }
}

const years = Object.keys(buckets).map(Number).sort();

let mdListed = "";
for (const year of years) {
  const lines = [];
  lines.push(`## ${year}`);
  lines.push(""); // blank line
  for (const [status, sites] of Object.entries(buckets[year])) {
    if (status === FIELD_LABEL[fields[0]]) {
      for (const site of sites) {
        const state = site.stateCode ? `, ${site.stateCode}` : "";
        lines.push(
          `**${new Date(site.dateProposed)?.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          })}:** ${site.name} _${site.city}${state}_  `,
        );
      }
    }
  }
  mdListed += "\n" + lines.join("\n") + "\n";
}

Bun.write("./lib/data/timeline-listed.md", mdListed);
