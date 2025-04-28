import SvgAir from "@/lib/icons/Air";
import SvgBuildings from "@/lib/icons/Buildings";
import SvgFish from "@/lib/icons/Fish";
import SvgGroundwater from "@/lib/icons/Groundwater";
import SvgLandfillGas from "@/lib/icons/LandfillGas";
import SvgLeachate from "@/lib/icons/Leachate";
import SvgLiquidWaste from "@/lib/icons/LiquidWaste";
import SvgNapl from "@/lib/icons/Napl";
import SvgOther from "@/lib/icons/Other";
import SvgResiduals from "@/lib/icons/Residuals";
import SvgSediment from "@/lib/icons/Sediment";
import SvgSludge from "@/lib/icons/Sludge";
import SvgSoil from "@/lib/icons/Soil";
import SvgSoilGas from "@/lib/icons/SoilGas";
import SvgSolidWaste from "@/lib/icons/SolidWaste";
import SvgSurfaceWater from "@/lib/icons/SurfaceWater";
import SvgDebris from "@/lib/icons/Debris";
import { IconComponent } from "@/lib/util/types";

export type ContaminantCategory = "air" | "water" | "ground" | "other";

export interface ContaminantContext {
  category: ContaminantCategory;
  icon: IconComponent;
  name: string;
  desc?: string;
}

export const contaminantContexts: Record<string, ContaminantContext> = {
  Air: {
    category: "air",
    icon: SvgAir,
    name: "Air",
    desc: "Burning, evaporating, or spraying toxics can all pollute air. Contamination can also rise as dust or vapors from soil or groundwater.",
  },
  "Soil Gas": {
    category: "air",
    icon: SvgSoilGas,
    name: "Vapors from soil",
    desc: "Invisible vapors trapped between soil particles can rise, “intruding” into buildings’ air, causing chronic health issues.",
  },
  "Landfill Gas": {
    category: "air",
    icon: SvgLandfillGas,
    name: "Gases from landfill",
    desc: "Dangerous gases can seep out of buried waste into buildings above, causing explosions and health issues.",
  },

  "Liquid Waste": {
    category: "water",
    icon: SvgLiquidWaste,
    name: "Liquid waste",
    desc: "Liquid industrial chemicals and toxic byproducts can easily flow into water if not properly contained.",
  },
  "Surface Water": {
    category: "water",
    icon: SvgSurfaceWater,
    name: "Surface water",
    desc: "Spills, runoff, & direct discharge can pollute nearby streams, rivers, & lakes, affecting drinking water & wildlife downstream.",
  },
  Groundwater: {
    category: "water",
    icon: SvgGroundwater,
    name: "Groundwater",
    desc: "Chemicals seeping or spilling down can contaminate underground water supplies that feed wells & springs.",
  },
  "Fish Tissue": {
    category: "water",
    icon: SvgFish,
    name: "Fish",
    desc: "Contaminants can accumulate in the bodies of fish from water & sediment, potentially exposing humans & wildlife.",
  },
  Leachate: {
    category: "water",
    icon: SvgLeachate,
    name: "Rainwater runoff",
    desc: "As rainwater flows through contamination, it forms toxic, odorous leachate or “garbage juice” that leaks downstream.",
  },
  "Free-phase NAPL": {
    category: "water",
    icon: SvgNapl,
    name: "Non-soluble liquids",
    desc: "Oil-like substances that do not mix with water, such as gasoline & motor oil, can form persistent underground plumes.",
  },

  "Solid Waste": {
    category: "ground",
    icon: SvgSolidWaste,
    name: "Solid waste",
    desc: "Discarded municipal garbage, industrial byproducts, & manufacturing waste can release harmful substances as it breaks down.",
  },
  Debris: {
    category: "ground",
    icon: SvgDebris,
    name: "Debris",
    desc: "Scattered waste materials, discarded equipment, & building rubble can contain asbestos, lead paint, PCBs, or other hazards.",
  },
  Sediment: {
    category: "ground",
    icon: SvgSediment,
    name: "Sediment",
    desc: "Mud, sand, & debris settles to the bottom of rivers, lakes, & oceans. It can trap heavy metals & pollutants for years.",
  },
  Sludge: {
    category: "ground",
    icon: SvgSludge,
    name: "Sludge",
    desc: "Semi-solid sludge from wastewater treatment can contain heavy metals & PFAS and be stored in pits/lagoons.",
  },
  Soil: {
    category: "ground",
    icon: SvgSoil,
    name: "Soil",
    desc: "Soil can absorb and hold onto pollutants for decades.",
  },
  "Buildings/Structures": {
    category: "ground",
    icon: SvgBuildings,
    name: "Buildings/structures",
    desc: "Homes, factories, & other constructions may contain lead paint, asbestos, or absorbed chemicals in their materials.",
  },

  Residuals: {
    category: "other",
    icon: SvgResiduals,
    name: "Residuals",
    desc: "After cleanup efforts, contaminants can remain in the soil, sediment, or groundwater.",
  },
  Other: {
    category: "other",
    icon: SvgOther,
    name: "Other",
  },
};

export const contaminantCategories: Record<
  ContaminantCategory,
  {
    name: string;
    color: string;
    contexts: Array<keyof typeof contaminantContexts>;
  }
> = {
  ground: {
    name: "Ground",
    color: "text-yellow-900",
    contexts: [
      "Solid Waste",
      "Debris",
      "Sediment",
      "Sludge",
      "Soil",
      "Buildings/Structures",
    ],
  },
  water: {
    name: "Water",
    color: "text-sky-700",
    contexts: [
      "Liquid Waste",
      "Surface Water",
      "Groundwater",
      "Fish Tissue",
      "Leachate",
      "Free-phase NAPL",
    ],
  },
  air: {
    name: "Air",
    color: "text-teal-700",
    contexts: ["Air", "Soil Gas", "Landfill Gas"],
  },
  other: {
    name: "Mixed",
    color: "text-neutral-500",
    contexts: ["Residuals", "Other"],
  },
};
