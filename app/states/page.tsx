import STATES from "@/lib/data/states.json" assert { type: "json" };
import Link from "next/link";

const bottomSectionAbbrevs = ["DC", "PR", "VI", "GU", "MP", "AS", "UM"];

function List({ states }: { states: typeof STATES }) {
  return (
    <ul>
      {states.map((state) => (
        <li key={state.abbrev}>
          <Link href={`/states/${state.abbrev}`}>{state.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default function Page() {
  return (
    <div>
      <h1>States</h1>
      <List
        states={STATES.filter(
          (state) => !bottomSectionAbbrevs.includes(state.abbrev),
        )}
      />
      <hr />
      <h2>Territories</h2>
      <List
        states={STATES.filter((state) =>
          bottomSectionAbbrevs.includes(state.abbrev),
        )}
      />
    </div>
  );
}
