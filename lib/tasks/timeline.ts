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

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

type MiniSite = Pick<Site, "id" | "name" | "city" | "stateCode">;

type Bucket = Record<
  number, // year
  Record<
    string, // month (0‑11)
    Record<
      string, // action label
      Array<Site>
    >
  >
>;
const buckets: Bucket = {};

for (const site of allSites) {
  fields.forEach((field) => {
    const raw = site[field];
    if (!raw) return; // blank ➜ ignore
    const d = new Date(String(raw));
    if (isNaN(d.getTime())) return; // bad date ➜ ignore
    // @ts-expect-error switching types
    site[field] = d; // update the site with the date

    const y = d.getUTCFullYear();
    const m = d.getUTCMonth(); // 0‑based
    const lbl = FIELD_LABEL[field];
    if (!lbl) return; // no label ➜ ignore

    // const { id, name, city, stateCode } = site;

    buckets[y] ??= {};
    buckets[y][m] ??= {};
    buckets[y][m][lbl] ??= [];
    buckets[y][m][lbl].push(site);
  });
}

let mdMain = `# Timeline

`;
const years = Object.keys(buckets).map(Number).sort();
for (const year of years) {
  const lines = [];
  const months = Object.keys(buckets[year]).map(Number).sort();
  lines.push(`## ${year}`);
  lines.push(""); // blank line
  for (const m of months) {
    lines.push(`### ${MONTHS[m]}\n`);
    for (const [status, sites] of Object.entries(buckets[year][m])) {
      for (const site of sites) {
        lines.push(`- ${status}: ${site.name}`);
      }
    }
    lines.push(""); // blank line between months
  }
  mdMain += "\n" + lines.join("\n");
}
Bun.write("./lib/data/timeline.md", mdMain);

let mdListed = "";
for (const year of years) {
  const lines = [];
  const months = Object.keys(buckets[year]).map(Number).sort();
  lines.push(`## ${year}`);
  lines.push(""); // blank line
  for (const m of months) {
    // lines.push(`### ${MONTHS[m]}\n`);
    for (const [status, monthSites] of Object.entries(buckets[year][m])) {
      if (status === FIELD_LABEL[fields[0]]) {
        for (const site of monthSites) {
          lines.push(
            `**${new Date(site.dateProposed)?.toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
            })}:** ${site.name} (${site.city}, ${site.stateCode})  `,
          );
        }
      }
    }
    // lines.push(""); // blank line between months
  }
  mdListed += "\n" + lines.join("\n") + "\n";
}

Bun.write("./lib/data/timeline-listed.md", mdListed);
