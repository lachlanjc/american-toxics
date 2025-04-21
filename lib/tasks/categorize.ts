import { Site } from "../data/site";
import { allSites } from "../data/api";
import { supabase } from "../supabaseClient";

const siteTypes: Record<string, Array<string>> = {
  military: [
    "air force",
    "army",
    "naval",
    "navy",
    "usdoe",
    "marine corp",
    "submarine",
    "nasa",
    "coast guard",
  ],
  mining: ["mine", "quarry", "sand", "gravel", "mining"],
  fuel: [
    "fuel",
    "gas",
    " oil", // avoid soil
    "well field",
    "wellfield",
    "well pad",
    "energy",
    "creosot",
    "refin",
    "petrol",
    "petro-process",
  ],
  dryclean: ["dry clean", "laundry", "cleaner"],
  chemical: [
    "chem",
    "spill",
    "pvc",
    "chlorine",
    "pesticide",
    "drum",
    "polymer",
    "latex",
    "hercules",
    "love canal",
    "hooker",
    "solvent",
    "kepone",
    "fertilizer",
    "midco",
    "tce",
    "pce",
    "tetrachloroethene",
  ],
  manufacturing: [
    "manufacturing",
    "factory",
    "tannery",
    "leather",
    "textile",
    "finishing",
    "firework",
    "westinghouse",
    " cement",
  ],
  metal: [
    "salvage",
    "metal",
    "slag",
    "aluminum",
    "steel",
    "iron",
    "copper",
    "zinc",
    "lead",
    "tungsten",
    "chrome",
    "smelter",
    "plating",
    "alcoa",
    "foundry",
  ],
  wood: [
    "wood",
    "paper",
    "koppers",
    "charcoal",
    " tie",
    " mill",
    "lumber",
    "pressure treat",
    "treating",
    "forest products",
  ],
  tech: [
    "silicon",
    "semi",
    "electronic",
    "capacitor",
    "computer",
    "intel",
    "micro",
    "siemens",
  ],
  water: [
    "creek",
    "lake",
    "river",
    "water",
    "municipal well",
    "sewer",
    "septic",
    "sanitation",
  ],
  waste: [
    "landfill",
    "dump",
    "disposal",
    "burn pit",
    "junk",
    "recycling",
    "waste",
    "refuse",
    "asbestos",
    "lagoon",
    "incinerator",
    "pit",
    "breaking",
  ],
};

export const classifySite = (site: { name: string }): string => {
  const siteName = site.name.toLowerCase();
  for (const [type, keywords] of Object.entries(siteTypes)) {
    if (keywords.some((keyword) => siteName.includes(keyword))) {
      return type;
    }
  }
  return "unknown";
};

// FOR PRODUCTION
const { data: allSites } = await supabase
  .from("sites")
  .select("id, name")
  .is("category", null)
  .limit(1000);

for (const site of allSites || []) {
  const category = classifySite(site);
  // if (category !== "unknown") {
  const { error } = await supabase
    .from("sites")
    .update({ category })
    .eq("id", site.id);
  if (error) {
    console.error("Error updating site:", site.id, site.name, error);
  } else {
    console.log("Updated site:", site.id, site.name, category);
  }
  // }
}

// FOR DEVELOPMENT
export const classifySites = (sites: Site[]): Record<string, Array<string>> => {
  const classifiedSites: Record<string, Array<string>> = {};
  sites.forEach((site) => {
    const type = classifySite(site);
    if (!classifiedSites[type]) {
      classifiedSites[type] = [];
    }
    classifiedSites[type].push(site.name);
  });
  return classifiedSites;
};

export const classifyAllSites = () => {
  const classifiedSites = classifySites(allSites);
  // Print top 12 words in unknown category
  const unknownSites = classifiedSites["unknown"];
  const unknownWords: Record<string, number> = {};
  unknownSites.forEach((site) => {
    const words = site.split(" ");
    words.forEach((word) => {
      if (!unknownWords[word]) {
        unknownWords[word] = 0;
      }
      unknownWords[word]++;
    });
  });
  const sortedUnknownWords = Object.entries(unknownWords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 70);
  console.log("Top words in unknown category:");
  sortedUnknownWords.forEach(([word, count]) => {
    console.log(`- ${word}: ${count}`);
  });
  console.log("Classified Sites:");
  Object.keys(classifiedSites)
    .sort()
    .map((type) => {
      const typeSites = classifiedSites[type].length;
      console.log(`${type}: ${typeSites}`);
    });
  return classifiedSites;
};

export const classifyAllSitesToFile = () => {
  const classifiedSites = classifyAllSites();
  Bun.write(
    "./lib/data/classified-sites.json",
    JSON.stringify(classifiedSites, null, 2),
  );
  console.log("Wrote classified sites file");
};

// classifyAllSitesToFile();
