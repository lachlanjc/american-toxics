import { WellRoot, WellTitle } from "@/lib/ui/well";
import { ContaminantList, processContaminants } from "@/lib/util/contaminants";
import clsx from "clsx";

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
import SvgChevronDown from "@/lib/icons/ChevronDown";
import { IconComponent } from "@/lib/util/types";

const colors: Record<string, string> = {
  water: "text-sky-700",
  air: "text-teal-700",
  ground: "text-yellow-900",
  neutral: "text-neutral-500",
};

interface Grouping {
  category: "air" | "water" | "ground" | "neutral";
  color: string;
  icon: IconComponent;
  label?: string;
  desc?: string;
}

export const groupings: Record<string, Grouping> = {
  Air: {
    category: "air",
    color: colors.air,
    icon: SvgAir,
    desc: "Burning, evaporating, or spraying toxics can all pollute air. Contamination can also rise as dust or vapors from soil or groundwater.",
  },
  "Soil Gas": {
    category: "air",
    color: colors.air,
    icon: SvgSoilGas,
    label: "Vapors from soil",
    desc: "Invisible vapors trapped between soil particles can rise into buildings’ air, causing chronic health issues. This is called “vapor intrusion.”",
  },
  "Landfill Gas": {
    category: "air",
    color: colors.air,
    icon: SvgLandfillGas,
    label: "Gases from landfill",
    desc: "Dangerous gases can seep out of buried waste into buildings above, causing explosions and health issues.",
  },

  "Liquid Waste": {
    category: "water",
    color: colors.water,
    icon: SvgLiquidWaste,
    label: "Liquid waste",
    desc: "Liquid industrial chemicals and toxic byproducts can easily flow into water if not properly contained.",
  },
  "Surface Water": {
    category: "water",
    color: colors.water,
    icon: SvgSurfaceWater,
    label: "Surface water",
    desc: "Runoff, spills, or direct discharge can pollute water. Carried by streams, rivers, & lakes downstream, it can affect drinking water & wildlife.",
  },
  Groundwater: {
    category: "water",
    color: colors.water,
    icon: SvgGroundwater,
    desc: "Underground water supplies feed wells and springs, often contaminated by chemicals seeping or spilling down.",
  },
  "Fish Tissue": {
    category: "water",
    color: colors.water,
    icon: SvgFish,
    label: "Fish",
    desc: "Contaminants can accumulate in the bodies of fish from water & sediment, potentially exposing humans & wildlife.",
  },
  Leachate: {
    category: "water",
    color: colors.water,
    icon: SvgLeachate,
    label: "Rainwater runoff",
    desc: "As rainwater flows through contamination, it forms toxic, odorous leachate or “garbage juice” that leaks downstream.",
  },
  NAPL: {
    category: "water",
    color: colors.water,
    icon: SvgNapl,
    label: "Non-soluble liquids",
    desc: "Oil-like substances that do not mix with water, such as gasoline & motor oil, can form persistent underground plumes.",
  },

  "Solid Waste": {
    category: "ground",
    color: colors.ground,
    icon: SvgSolidWaste,
    label: "Solid waste",
    desc: "Discarded municipal garbage, industrial byproducts, & manufacturing waste can release harmful substances as it breaks down.",
  },
  Debris: {
    category: "ground",
    color: colors.ground,
    icon: SvgDebris,
    desc: "Scattered waste materials, discarded equipment, & building rubble can contain asbestos, lead paint, PCBs, or other hazards.",
  },
  Sediment: {
    category: "ground",
    color: colors.ground,
    icon: SvgSediment,
    desc: "Mud, sand, & debris settles to the bottom of rivers, lakes, & oceans. It can trap heavy metals & pollutants for years.",
  },
  Sludge: {
    category: "ground",
    color: colors.ground,
    icon: SvgSludge,
    // label: "Wastewater treatment solids",
    desc: "Semi-solid sludge from wastewater treatment can contain heavy metals & PFAS and be stored in pits/lagoons.",
  },
  Soil: {
    category: "ground",
    color: colors.ground,
    icon: SvgSoil,
    desc: "Soil can absorb and hold onto pollutants for decades.",
  },

  "Buildings/Structures": {
    category: "ground",
    color: colors.ground,
    icon: SvgBuildings,
    label: "Buildings/structures",
    desc: "Homes, factories, & other constructions may contain lead paint, asbestos, or absorbed chemicals in their materials.",
  },
  Residuals: {
    category: "air",
    color: colors.neutral,
    icon: SvgResiduals,
    label: "Residuals",
    desc: "After cleanup efforts, contaminants can remain in the soil, sediment, or groundwater.",
  },
  Other: {
    category: "air",
    color: colors.neutral,
    icon: SvgOther,
  },
};

function ContaminantGroup({
  title,
  contaminants,
}: React.PropsWithChildren<{
  title: string;
  contaminants: Array<string>;
}>) {
  const grouping: Grouping | undefined = groupings[title];
  const Icon = grouping?.icon as React.FC<React.SVGProps<SVGSVGElement>>;
  return (
    <details className="mt-1">
      <summary className="flex gap-2 items-center cursor-pointer leading-tight overflow-clip">
        {Icon && (
          <Icon
            width={20}
            height={20}
            className={clsx(grouping.color, "-ml-px shrink-0")}
            aria-hidden
          />
        )}
        <span>
          <strong className="font-sans text-base font-medium">
            {grouping?.label || title}
          </strong>
          <small className="font-mono text-xs text-neutral-600 ml-1">
            ({contaminants.length} contaminant
            {contaminants.length === 1 ? "" : "s"})
          </small>
        </span>
        <SvgChevronDown
          width={20}
          height={20}
          className="-mr-1 ml-auto text-neutral-400 transition-transform in-open:rotate-180"
          aria-hidden
        />
      </summary>
      <ul
        className="pl-7 -ml-px pt-1 text-neutral-600 text-xs flex flex-col gap-2"
        role="list"
      >
        {contaminants.map((contaminant) => (
          <li key={contaminant}>{contaminant}</li>
        ))}
      </ul>
    </details>
  );
}

export function Contaminants({
  contaminants,
}: {
  contaminants: ContaminantList;
}) {
  const groups = Object.entries(Object.groupBy(contaminants, (c) => c.media))
    .filter((g) => Array.isArray(g[1]) && g[1].length > 0)
    // @ts-expect-error sort by contaminant count
    .sort((a, b) => b[1].length - a[1].length);
  return (
    <WellRoot>
      <WellTitle>Contamination</WellTitle>
      {groups.map(([media, sublist]) => (
        <ContaminantGroup
          key={media}
          title={media}
          contaminants={processContaminants(sublist || [])}
        />
      ))}
    </WellRoot>
  );
}
