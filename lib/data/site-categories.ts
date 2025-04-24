import { SupabaseSite } from "./site";

import SvgChemicals from "../icons/Chemicals";
import SvgWater from "../icons/Water";
import SvgTech from "../icons/Tech";
import SvgWood from "../icons/Wood";
import SvgOther from "../icons/Other";
import SvgFactory from "../icons/Factory";
import SvgFuel from "../icons/Fuel";
import SvgMining from "../icons/Mining";
import SvgWar from "../icons/War";
import SvgWaste from "../icons/Waste";
import SvgDryCleaning from "../icons/DryCleaning";
import SvgMetal from "../icons/Metal";
import SvgWarning from "../icons/Warning";
import { IconComponent } from "../util/types";

export const categories: Record<
  Exclude<SupabaseSite["category"], null>,
  {
    color: string;
    icon: IconComponent;
    name: string;
    desc?: string;
  }
> = {
  military: {
    color: "text-emerald-600",
    icon: SvgWar,
    name: "Military",
    desc: "U.S. military bases & weaponry facilities contaminated with munitions, fuels, radioactive waste, & other hazards.",
  },
  chemical: {
    color: "text-lime-600",
    icon: SvgChemicals,
    name: "Chemicals",
    desc: "Chemical plants, storage facilities, & disposal areas polluted with industrial chemicals, solvents, & manufacturing byproducts.",
  },
  mining: {
    color: "text-violet-600",
    icon: SvgMining,
    name: "Mining",
    desc: "Abandoned mines, tailings piles, & processing facilities that leak heavy metals & acids.",
  },
  fuel: {
    color: "text-red-600",
    icon: SvgFuel,
    name: "Fuel",
    desc: "Leaking refineries, storage tanks, & pipelines where petroleum products have seeped into the environment.",
  },
  dryclean: {
    color: "text-fuchsia-600",
    icon: SvgDryCleaning,
    name: "Dry cleaning",
    desc: "Dry cleaning companies that improperly handled harsh solvents like PERC.",
  },
  manufacturing: {
    color: "text-sky-600",
    icon: SvgFactory,
    name: "Manufacturing",
    desc: "Factories that leaked or spread toxic solvents, metals, & industrial waste.",
  },
  metal: {
    color: "text-slate-600",
    icon: SvgMetal,
    name: "Metals",
    desc: "Smelters, foundries, & processing facilities that released heavy metals like lead & arsenic.",
  },
  wood: {
    color: "text-yellow-900",
    icon: SvgWood,
    name: "Wood",
    desc: "Lumber, paper, & wood treatment mills that improperly used toxic chemicals like creosote.",
  },
  tech: {
    color: "text-orange-600",
    icon: SvgTech,
    name: "Tech",
    desc: "Electronics & semiconductor plants where production solvents and metals have harmed workers & the environment.",
  },
  water: {
    color: "text-blue-600",
    icon: SvgWater,
    name: "Water",
    desc: "Sewage treatment plants and polluted rivers & water bodies that threaten drinking water supplies & ecosystems.",
  },
  waste: {
    color: "text-stone-500",
    icon: SvgWaste,
    name: "Waste",
    desc: "Landfills, illegal dump sites, junkyards, & incinerators where hazardous materials weren’t contained.",
  },
  radioactive: {
    color: "text-yellow-500",
    icon: SvgWarning,
    name: "Radioactive",
    desc: "Uranium mines/facilities, nuclear power plants, & sites contaminated with radioactive materials. (Find atomic weapons in the military category.)",
  },
  other: {
    color: "text-neutral-600",
    icon: SvgOther,
    name: "Other",
  },
  unknown: {
    color: "text-neutral-600",
    icon: SvgOther,
    name: "Unknown",
  },
};
