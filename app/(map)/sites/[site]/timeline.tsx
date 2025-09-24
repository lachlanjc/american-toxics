import { nplStatuses, type Site } from "@/lib/data/site";
import { WellRoot } from "@/lib/ui/well";

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
    <WellRoot className="pt-4">
      <ul className="flex flex-col gap-1 text-sm @md:flex-row @md:justify-between @md:px-4">
        {Object.keys(nplStatuses).map((statusKey) => {
          const status = nplStatuses[statusKey as keyof typeof nplStatuses];
          const value = site[status.field] as string | undefined;
          return (
            <li
              key={statusKey}
              className="flex gap-x-2 @md:flex-col items-baseline @md:items-center"
            >
              <div className={`${status.color} shrink-0 @md:mb-1 self-center`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                >
                  {value ? (
                    <path
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  ) : (
                    <circle
                      cx="10"
                      cy="10"
                      r="6"
                      stroke="currentColor"
                      strokeWidth={2}
                      fill="transparent"
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
