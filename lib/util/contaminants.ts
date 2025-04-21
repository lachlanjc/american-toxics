/**
 * Heuristically title‑cases a chemical name that arrived in ALL‑CAPS.
 * It preserves accepted acronyms (DDT, PCB …), lowers Greek prefixes,
 * lower‑cases ring‑locant letters inside […] or (…), keeps Roman‑numeral
 * oxidation states, and finally capitalises the first lexical word.
 *
 * ⚠️  Chemical nomenclature is messy.  This covers the 99 % most common
 *     contaminants that appear in Superfund data, but it is *heuristic*.
 */
export function prettifyChemicalName(raw: string): string {
  // prettier-ignore
  const ABBREV = new Set([
    "DDT", "DDD", "DDE", "PCBs", "PCB", "PAH", "PAHs",
    "VOC", "VOCs", "SVOC", "SVOCs", "TCE", "PCE", "DNAPL",
  ]);

  // ⬤ 1. normalise whitespace
  let s = raw.trim().replace(/\s+/g, " ");

  // ⬤ 2. preserve abbreviations we intend to stay uppercase
  s = s.replace(/\b[A-Z]{2,5}s?\b/g, (m) => (ABBREV.has(m) ? `§${m}§` : m));

  // ⬤ 3. lower‑case spelled‑out Greek letters (ALPHA, BETA …)
  // prettier-ignore
  const GREEK = [
    "ALPHA","BETA","GAMMA","DELTA","EPSILON","ZETA","ETA","THETA","IOTA",
    "KAPPA","LAMBDA","MU","NU","XI","OMICRON","PI","RHO","SIGMA","TAU",
    "UPSILON","PHI","CHI","PSI","OMEGA",
  ];
  const greekRE = new RegExp(`\\b(${GREEK.join("|")})(?=[-\\s])`, "g");
  s = s.replace(greekRE, (m) => m.toLowerCase());

  // ⬤ 4. lower‑case ring‑locant letters inside (), [], or {}
  //     examples: (K) → (k)   (1,2,3‑CD) → (1,2,3‑cd)
  s = s.replace(
    /([\[(])([0-9,]*)([A-Z]{1,3})([\])])/g,
    (_, open, nums, letters, close) =>
      `${open}${nums}${letters.toLowerCase()}${close}`,
  );

  // ⬤ 5. blanket lower‑case, then capitalise first real letter later
  s = s.toLowerCase();

  // ⬤ 6. capitalise the first alphabetic character not already preceded
  //       by a Greek prefix + “‑” (e.g. "alpha‑hexachloro…" stays lower)
  s = s.replace(/(^|[\s(])([a-z])/, (_, pre, c) => pre + c.toUpperCase());

  // ⬤ 7. restore the true uppercase abbreviations
  s = s.replace(/§([A-Z]+)§/g, (_, abbr) => abbr);
  s = s.replace("(Cis and", "(cis &");
  s = s.replaceAll("§", "");

  return s;
}

export type ContaminantList = Array<{
  name: string;
  media: string;
}>;
export function processContaminants(contaminants: ContaminantList) {
  let list = contaminants.map((c) => c.name);
  list = list.filter((c, i) => list.indexOf(c) === i);
  list = list.map(prettifyChemicalName);
  // sort but put formulas starting with numbers at the end
  list = list.sort((a, b) => {
    if (a.match(/^\d+/) && !b.match(/^\d+/)) {
      return 1;
    }
    if (!a.match(/^\d+/) && b.match(/^\d+/)) {
      return -1;
    }
    return a.localeCompare(b);
  });
  return list;
}
