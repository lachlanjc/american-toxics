import { nplStatuses } from "@/lib/data/site";
import { allSites } from "@/lib/data/api";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { Link } from "next-view-transitions";
import { Count } from "@/lib/ui/count";

export function metadata() {
  return {
    title: "Superfund Sites by NPL Status",
    description:
      "Explore the most hazardous waste sites in the U.S. according to the EPA’s National Priorities List (NPL) status.",
  };
}

export default function Page() {
  return (
    <>
      <HeaderRoot showClose>
        <HeaderTitle>Superfund Sites by NPL Status</HeaderTitle>
        <HeaderSubtitle>
          The National Priorities List (NPL) is a list of the most hazardous
          waste sites in the U.S. Track&nbsp;sites by their status on the NPL.
        </HeaderSubtitle>
      </HeaderRoot>
      <ul className="-mb-1 text-neutral-500 gap-8 flex flex-col" role="list">
        {Object.keys(nplStatuses).map((key, i) => {
          const status = nplStatuses[key];
          const count = allSites.filter((site) => site.npl === key).length;
          return (
            <li
              key={key}
              role="listitem"
              className="flex w-full gap-3 group items-center even:justify-end md:max-w-md py-4"
            >
              <Link href={`/npl/${key}`} className="contents">
                <span
                  className={`${status.color} origin-left bg-current w-4 h-4 rounded-full inline-block`}
                  style={{ scale: Math.max(1, count / 70) }}
                />
                <div className="flex flex-col items-start relative z-1">
                  <span
                    className="font-sans text-lg md:text-2xl font-medium text-black transition-colors group-hover:text-neutral-600 ml-2"
                    style={{ viewTransitionName: key }}
                  >
                    {status.label}
                  </span>
                  <Count value={count} />
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
