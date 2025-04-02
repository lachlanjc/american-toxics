import csv from "csvtojson";

const input = Bun.file("./lib/data/sites.csv");
const csvString = await input.text();
const jsonObj = await csv({
  colParser: {
    semsId: "string",
  },
  checkType: true,
}).fromString(csvString);

Bun.write("./lib/data/sites.json", JSON.stringify(jsonObj));
console.log("CSV to JSON conversion complete.");
