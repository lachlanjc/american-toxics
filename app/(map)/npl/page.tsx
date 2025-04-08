import { nplStatuses } from "@/lib/data/site";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { Link } from "next-view-transitions";

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
          waste sites in the U.S. Track sites by status.
        </HeaderSubtitle>
      </HeaderRoot>
      <ul className="-mb-1 text-neutral-500" role="list">
        {Object.keys(nplStatuses).map((key) => {
          const status = nplStatuses[key];
          return (
            <li key={key} role="listitem" className="">
              <Link
                href={`/npl/${key}`}
                className="flex w-full gap-3 items-center group py-1"
              >
                <span
                  className={`${status.color} bg-current w-4 h-4 rounded-full inline-block`}
                />
                <span
                  className="font-sans text-black transition-colors group-hover:text-neutral-600"
                  style={{ viewTransitionName: key }}
                >
                  {status.label}
                </span>
                {/* <small className="text-neutral-500 ml-auto">
                        {status.count} sites
                      </small> */}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
