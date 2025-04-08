import csv from "csvtojson";
import states from "@/lib/data/states-raw.json" assert { type: "json" };
import { SiteNPLStatus } from "@/lib/data/site";

const nplStatuses: Record<string, SiteNPLStatus> = {
  "Proposed NPL Site": SiteNPLStatus.Proposed,
  "Deleted NPL Site": SiteNPLStatus.Deleted,
  "NPL Site": SiteNPLStatus.Active,
};

const input = Bun.file("./lib/data/sites.csv");
const csvString = await input.text();
const jsonObj = await csv({
  colParser: {
    semsId: "string",
  },
  checkType: true,
}).fromString(csvString);
for (const site of jsonObj) {
  site.stateName = site.state.trim();
  site.stateCode = states.find(
    (state) => state.name === site.stateName,
  )?.abbrev;
  delete site.state;
  site.npl = nplStatuses[site.status] ?? "";
  delete site.status;
}

Bun.write("./lib/data/sites.json", JSON.stringify(jsonObj));
console.log(`CSV to JSON conversion complete: ${jsonObj.length} sites`);

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
