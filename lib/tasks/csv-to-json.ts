import csv from "csvtojson";
import states from "@/lib/data/states-raw.json" assert { type: "json" };
import { nplStatuses } from "@/lib/data/site";

// Convert MM/DD/YYYY string to ISO (YYYY-MM-DD)
function toISO(dateStr: string): string {
  if (dateStr.length === 0) return "";
  const [m, d, y] = dateStr.split("/");
  const mm = m.padStart(2, "0");
  const dd = d.padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

const input = Bun.file("./lib/data/sites-raw.csv");
const csvString = await input.text();
const jsonObj = await csv({
  colParser: {
    semsId: "string",
    dateProposed: toISO,
    dateDeleted: toISO,
    dateCompleted: toISO,
    dateListed: toISO,
    dateNOID: toISO,
  },
  checkType: true,
}).fromString(csvString);
for (const site of jsonObj) {
  site.id = site.id
    .trim()
    .replace(/\.000?/, "")
    .replace(/[ \s]+/g, "");
  site.stateName = site.state.trim();
  site.stateCode = states.find(
    (state) => state.name === site.stateName,
  )?.abbrev;
  delete site.state;

  site.npl = "proposed";
  Object.keys(nplStatuses).forEach((status) => {
    const fieldName = nplStatuses[status].field;
    if (site[fieldName]) site.npl = status;
  });
  delete site.status;
  delete site.hasPartialDeletion;
}

Bun.write("./lib/data/sites.json", JSON.stringify(jsonObj));
console.log(`CSV to JSON conversion complete: ${jsonObj.length} sites`);

const miniKeys = ["id", "lat", "lng", "npl"];
const miniJson = structuredClone(jsonObj)
  .map((site) => {
    const miniSite: Record<string, any> = {};
    miniKeys.forEach((key) => {
      miniSite[key] = site[key];
    });
    return miniSite;
  })
  .sort((a, b) => b.lat - a.lat);
Bun.write("./lib/data/sites-mini.json", JSON.stringify(miniJson));
console.log("Wrote mini sites file");

// OG data from https://gist.github.com/claraj/3880cd48b3d8cb3a7f900aeb30b18fdd, added abbrev
const newStates = structuredClone(states);
for (const state of newStates) {
  const sites = jsonObj.filter(
    (site) => site.stateCode === state.abbrev,
  ).length;
  // @ts-expect-error new prop
  state.count = sites;
}
Bun.write("./lib/data/states.json", JSON.stringify(newStates));
console.log("Wrote states file");
