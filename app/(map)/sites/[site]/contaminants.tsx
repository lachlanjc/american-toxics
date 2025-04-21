import { WellRoot, WellTitle } from "@/lib/ui/well";
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
import { prettifyContaminantArray } from "@/lib/util/contaminants";
import clsx from "clsx";

const colors: Record<string, string> = {
  water: "text-blue-700/60",
  air: "text-teal-700/60",
  ground: "text-yellow-900/60",
  neutral: "text-neutral-900/50",
};

export const groupings: Record<
  string,
  { color: string; icon: unknown; alias?: string }
> = {
  "Landfill Gas": {
    color: colors.air,
    icon: SvgLandfillGas,
    alias: "Gases from landfill",
  },
  "Soil Gas": {
    color: colors.air,
    icon: SvgSoilGas,
    alias: "Vapors from soil",
  },
  Air: { color: colors.air, icon: SvgAir },

  "Liquid Waste": {
    color: colors.water,
    icon: SvgLiquidWaste,
    alias: "Liquid waste",
  },
  Groundwater: { color: colors.water, icon: SvgGroundwater },
  "Surface Water": {
    color: colors.water,
    icon: SvgSurfaceWater,
    alias: "Surface water",
  },
  Sediment: { color: colors.water, icon: SvgSediment },
  Fish: { color: colors.water, icon: SvgFish },
  Leachate: {
    color: colors.water,
    icon: SvgLeachate,
    alias: "Rainwater runoff",
  },
  NAPL: { color: colors.water, icon: SvgNapl, alias: "Non-soluble liquids" },

  "Solid Waste": {
    color: colors.ground,
    icon: SvgSolidWaste,
    alias: "Solid waste",
  },
  Debris: { color: colors.ground, icon: SvgDebris },
  Sludge: {
    color: colors.ground,
    icon: SvgSludge,
    alias: "Wastewater treatment solids",
  },
  Soil: { color: colors.ground, icon: SvgSoil },

  Buildings: { color: colors.neutral, icon: SvgBuildings },
  Residuals: {
    color: colors.neutral,
    icon: SvgResiduals,
    alias: "Cleanup byproducts",
  },
  Other: { color: colors.neutral, icon: SvgOther },
};

function ContaminantGroup({
  title,
  contaminants,
}: React.PropsWithChildren<{
  title: string;
  contaminants: Array<string>;
}>) {
  const grouping = groupings[title];
  const Icon = grouping.icon as React.FC<React.SVGProps<SVGSVGElement>>;
  return (
    <details className="mt-1">
      <summary className="flex gap-2 items-center cursor-pointer">
        {Icon && (
          <Icon
            width={16}
            height={16}
            className={clsx(grouping.color)}
            aria-hidden
          />
        )}
        <span className="font-sans text-base">
          {grouping.alias || title}
          <small className="font-mono text-xs text-neutral-600 ml-1">
            ({contaminants.length} contaminant
            {contaminants.length === 1 ? "" : "s"})
          </small>
        </span>
        <SvgChevronDown
          className="w-4 h-4 -mr-1 ml-auto text-neutral-600 transition-transform in-open:rotate-180"
          aria-hidden
        />
      </summary>
      <ul
        className="pl-6 pt-2 text-neutral-600 text-xs flex flex-col gap-2"
        role="list"
      >
        {contaminants.map((contaminant) => (
          <li key={contaminant}>{contaminant}</li>
        ))}
      </ul>
    </details>
  );
}

type ContaminantList = Array<{
  name: string;
  media: string;
}>;
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
    <WellRoot className="mt-4">
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

function processContaminants(contaminants: ContaminantList) {
  let list = contaminants.map((c) => c.name);
  list = list.filter((c, i) => list.indexOf(c) === i).sort();
  list = prettifyContaminantArray(list);
  console.log(list);
  return list;
}
