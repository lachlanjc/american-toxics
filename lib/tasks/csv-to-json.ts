import csv from "csvtojson";
import states from "@/lib/data/states.json" assert { type: "json" };

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
}

Bun.write("./lib/data/sites.json", JSON.stringify(jsonObj));
console.log("CSV to JSON conversion complete.");
