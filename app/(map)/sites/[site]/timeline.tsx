import Link from "next/link";
import { nplStatuses, type Site } from "@/lib/data/site";
import SvgInfo from "@/lib/icons/Info";
import { WellRoot, WellTitle } from "@/lib/ui/well";

function formatDate(dateString?: string) {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return null;
  }
}

export function SiteNPLStatusTimeline({ site }: { site: Site }) {
  return (
    <WellRoot>
      <WellTitle className="mb-4 flex items-center gap-2">
        <span>Timeline</span>
        <Link className="-mb-1" href="/npl">
          <SvgInfo
            aria-hidden
            className="text-neutral-500 transition-colors hover:text-neutral-700"
            height={20}
            width={20}
          />
          <span className="sr-only">Learn about cleanup statuses</span>
        </Link>
      </WellTitle>
      <ul className="flex @md:flex-row flex-col @md:justify-between gap-1 @md:px-4 text-sm">
        {Object.keys(nplStatuses).map((statusKey) => {
          const status = nplStatuses[statusKey as keyof typeof nplStatuses];
          const value = site[status.field] as string | undefined;
          return (
            <li
              className="flex @md:flex-col @md:items-center items-baseline gap-x-2"
              key={statusKey}
            >
              <div className={`${status.color} @md:mb-1 shrink-0 self-center`}>
                <svg
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {value ? (
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  ) : (
                    <circle
                      cx="10"
                      cy="10"
                      fill="transparent"
                      r="6"
                      stroke="currentColor"
                      strokeWidth={2}
                    />
                  )}
                </svg>
              </div>
              <div
                className={`font-sans text-base ${value ? "font-medium" : "text-neutral-500"}`}
              >
                {status.label}
              </div>
              <small className="text-neutral-500">{formatDate(value)}</small>
            </li>
          );
        })}
      </ul>
    </WellRoot>
  );
}
