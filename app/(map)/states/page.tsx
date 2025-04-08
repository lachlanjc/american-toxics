import STATES from "@/lib/data/states.json" assert { type: "json" };
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Link } from "next-view-transitions";

const nonStates = ["DC", "PR", "VI", "GU", "MP", "AS", "UM"];

function List({ states }: { states: typeof STATES }) {
  return (
    <ol className="-mb-1 text-neutral-500" role="list">
      {states.map((state, i) => (
        <li key={state.abbrev} role="listitem" className="">
          <Link
            href={`/states/${state.abbrev}`}
            className="flex w-full gap-2 align-baseline group py-1"
          >
            <span className="text-neutral-500 select-none">
              {i < 9 ? 0 : null}
              {i + 1}.
            </span>
            <span
              className="font-sans text-black transition-colors group-hover:text-neutral-600"
              style={{ viewTransitionName: state.abbrev }}
            >
              {state.name}{" "}
            </span>
            <small className="text-neutral-500 ml-auto">
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
      <h2 className="text-xl font-bold font-sans tracking-tight mb-4">
        Territories
      </h2>
      <List
        states={STATES.filter((state) => nonStates.includes(state.abbrev)).sort(
          (a, b) => b.count - a.count,
        )}
      />
    </>
  );
}
