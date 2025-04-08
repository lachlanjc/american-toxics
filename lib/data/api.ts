import SITES from "./sites.json" assert { type: "json" };
import { Site } from "./site";

export const allSites = SITES as Array<Site>;

export const findSiteById = (id: string) =>
  allSites.find((site) => site.id === id);
