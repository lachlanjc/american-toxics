import STATES from "@/lib/data/states.json" assert { type: "json" };
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Heading } from "@/lib/ui/typography";
import { Link } from "next-view-transitions";
import * as States from "@/lib/icons/states";

const nonStates = ["DC", "PR", "VI", "GU", "MP", "AS", "UM"];

function List({ states }: { states: typeof STATES }) {
  const maxSites = Math.max(...states.map((state) => state.count));
  return (
    <ol className="-mt-2 last:mt-0 -mb-1 text-neutral-500 -mx-2" role="list">
      {states.map((state) => {
        const Outline = States[state.abbrev as keyof typeof States];
        return (
          <li key={state.abbrev} role="listitem" className="mb-1">
            <Link
              href={`/states/${state.abbrev}`}
              className="flex w-full gap-3 items-center py-1 transition-opacity hover:opacity-60 rounded-md px-2"
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
                  className="w-7 h-7 fill-neutral-400 -my-2"
                />
              )}
              <span
                className="font-sans text-lg text-black"
                style={{ viewTransitionName: state.abbrev }}
              >
                {state.name}{" "}
              </span>
              <small className="text-neutral-600 text-xs ml-auto">
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
      <HeaderRoot showClose>
        <HeaderTitle>Superfund Sites by State</HeaderTitle>
      </HeaderRoot>
      <List
        states={STATES.filter(
          (state) => !nonStates.includes(state.abbrev),
        ).sort((a, b) => b.count - a.count)}
      />
      <hr className="border-black/20 -mx-6 my-6" />
      <Heading>Territories</Heading>
      <List
        states={STATES.filter((state) => nonStates.includes(state.abbrev)).sort(
          (a, b) => b.count - a.count,
        )}
      />
    </>
  );
}
