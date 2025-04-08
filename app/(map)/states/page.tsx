import STATES from "@/lib/data/states.json" assert { type: "json" };
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Heading } from "@/lib/ui/typography";
import { Link } from "next-view-transitions";

const nonStates = ["DC", "PR", "VI", "GU", "MP", "AS", "UM"];

function List({ states }: { states: typeof STATES }) {
  return (
    <ol className="-mt-2 last:mt-0 -mb-1 text-neutral-500" role="list">
      {states.map((state) => (
        <li key={state.abbrev} role="listitem" className="">
          <Link
            href={`/states/${state.abbrev}`}
            className="flex w-full gap-3 items-center py-1 transition-opacity hover:opacity-60"
          >
            {/* <span className="text-neutral-600 select-none">
              {i < 9 ? 0 : null}
              {i + 1}.
            </span> */}
            {!nonStates.includes(state.abbrev) && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={`https://raw.githubusercontent.com/coryetzkorn/state-svg-defs/refs/heads/master/SVG/${state.abbrev}.svg`}
                width={32}
                height={32}
                alt={state.name}
                className="w-7 h-7 opacity-30 -my-2 object-fit"
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
      ))}
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
