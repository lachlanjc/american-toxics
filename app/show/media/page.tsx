import { groupings } from "@/app/(map)/sites/[site]/contaminants";
import clsx from "clsx";

const categories = {
  ground: "Ground",
  water: "Water",
  air: "Air",
};

export default function Page() {
  return (
    <main className="w-fit px-12 pt-8 mx-auto grid grid-cols-3 grid-rows-[auto_repeat(6,auto)] gap-x-16 gap-y-8">
      {Object.keys(categories).map((category) => (
        <>
          <h1 className="text-black font-bold font-sans text-5xl tracking-tight mb-2 row-start-1">
            {categories[category as keyof typeof categories]}
          </h1>
          <ul
            className="grid grid-rows-subgrid row-start-2 row-span-6"
            role="list"
          >
            {Object.keys(groupings)
              // .filter((key) => key !== "other")
              .filter(
                (key) =>
                  groupings[key as keyof typeof groupings].category ===
                  category,
              )
              .map((key) => {
                const media = groupings[key as keyof typeof groupings];
                const Icon = media.icon;
                return [
                  key === "Residuals" && (
                    <hr className="border-neutral-300 self-center" key="hr" />
                  ),
                  <li
                    key={key}
                    className="grid grid-cols-[auto_1fr] w-full gap-x-3 items-start md:max-w-md"
                  >
                    <Icon
                      width={48}
                      height={48}
                      className={clsx(media.color, "-ml-1")}
                      aria-hidden
                    />
                    <div>
                      <strong className="font-sans text-lg md:text-xl font-medium text-black">
                        {media.label || key}
                      </strong>
                      {media.desc && (
                        <p className="mt-1 text-pretty text-neutral-600 font-mono text-xs leading-relaxed">
                          {media.desc}
                        </p>
                      )}
                    </div>
                  </li>,
                ];
              })}
          </ul>
        </>
      ))}
    </main>
  );
}
