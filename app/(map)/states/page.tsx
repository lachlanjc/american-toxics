import { Link } from "next-view-transitions";
import STATES from "@/lib/data/states.json" with { type: "json" };
import * as States from "@/lib/icons/states";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Heading } from "@/lib/ui/typography";

const nonStates = ["DC", "PR", "VI", "GU", "MP", "AS", "UM"];

function List({ states }: { states: typeof STATES }) {
  const maxSites = Math.max(...states.map((state) => state.count));
  return (
    <ol className="-mt-2 -mb-1 -mx-2 text-neutral-500 last:mt-0" >
      {states.map((state) => {
        const Outline = States[state.abbrev as keyof typeof States];
        return (
          <li className="mb-1" key={state.abbrev} >
            <Link
              className="flex w-full items-center gap-3 rounded-md px-2 py-1 transition-opacity hover:opacity-60"
              href={`/states/${state.abbrev}`}
              style={{
                backgroundImage: `linear-gradient(${[
                  "to right",
                  "hsl(0 0 0 / 5%) 0%",
                  `hsl(0 0 0 / 5%) ${(state.count * 100) / maxSites}%`,
                  `transparent ${(state.count * 100) / maxSites}%`,
                  "transparent 100%",
                ].join(", ")})`,
              }}
            >
              {Outline && (
                <Outline
                  aria-label={state.name}
                  className="-my-2 h-7 w-7 fill-neutral-400"
                />
              )}
              <span
                className="font-sans text-black text-lg"
                style={{ viewTransitionName: state.abbrev }}
              >
                {state.name}{" "}
              </span>
              <small className="ml-auto text-neutral-600 text-xs">
                {state.count} site{state.count === 1 ? "" : "s"}
              </small>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

export default function Page() {
  return (
    <>
      <HeaderRoot>
        <HeaderTitle>Superfund Sites by State</HeaderTitle>
      </HeaderRoot>
      <List
        states={STATES.filter(
          (state) => !nonStates.includes(state.abbrev)
        ).sort((a, b) => b.count - a.count)}
      />
      <hr className="-mx-6 my-6 border-black/20" />
      <Heading>Territories</Heading>
      <List
        states={STATES.filter((state) => nonStates.includes(state.abbrev)).sort(
          (a, b) => b.count - a.count
        )}
      />
    </>
  );
}
