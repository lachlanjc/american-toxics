import type { Metadata } from "next";
import Link from "next/link";
import { nplStatuses } from "@/lib/data/site";
import { supabase } from "@/lib/supabaseClient";
import { Count } from "@/lib/ui/count";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";

export const metadata: Metadata = {
  title: "Superfund Sites by NPL Status",
  description:
    "Explore the most hazardous waste sites in the U.S. according to the EPA’s National Priorities List (NPL) status.",
};

export default async function Page() {
  const { data, error } = await supabase.from("sites").select("npl");
  if (error || !data) {
    throw new Error("Unable to load NPL status counts");
  }
  const grouped = Object.groupBy(data, (site) => site.npl ?? "unknown");
  return (
    <>
      <HeaderRoot>
        <HeaderTitle>Superfund Sites by Cleanup Status</HeaderTitle>
        <HeaderSubtitle>
          The National Priorities List (NPL) is a list of the most hazardous
          waste sites in the U.S. Track&nbsp;sites by their status on the NPL.
        </HeaderSubtitle>
      </HeaderRoot>
      <ul className="-mb-1 flex flex-col gap-8 text-neutral-500">
        {Object.keys(nplStatuses).map((key) => {
          const status = nplStatuses[key];
          const count = grouped[key]?.length ?? 0;
          return (
            <li
              className="group flex w-full items-center gap-6 py-2 md:max-w-md"
              key={key}
            >
              <Link className="contents" href={`/npl/${key}`}>
                <span
                  className={`${status.color} inline-block aspect-square w-4 shrink-0 rounded-full bg-current`}
                  style={{ width: Math.max(16, count / 5.5) }}
                />
                <div className="flex flex-col items-start gap-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="font-bold font-display text-black text-lg transition-colors group-hover:text-neutral-600"
                      style={{ viewTransitionName: key }}
                    >
                      {status.label}
                    </span>
                    <Count value={count} />
                  </div>
                  <p className="text-balance">{status.desc}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
