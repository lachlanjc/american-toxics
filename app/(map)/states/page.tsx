import STATES from "@/lib/data/states.json" assert { type: "json" };
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import Link from "next/link";

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
            <span className="text-neutral-500 select-none">{i + 1}.</span>
            <span className="font-sans text-black transition-colors group-hover:text-neutral-600">
              {state.name}{" "}
            </span>
            <small className="text-neutral-500 ml-auto">
              {state.count} sites
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
      <hr />
      <h2>Territories</h2>
      <List
        states={STATES.filter((state) => nonStates.includes(state.abbrev)).sort(
          (a, b) => b.count - a.count,
        )}
      />
    </>
  );
}
