import clsx from "clsx";
import {
  contaminantCategories,
  contaminantContexts,
} from "@/lib/data/contaminants";

export const metadata = { title: "Contexts" };

export default function Page() {
  return (
    <main className="w-fit px-12 pt-8 mx-auto grid grid-cols-3 grid-rows-[auto_repeat(8,auto)] gap-x-16 gap-y-8">
      {Object.entries(contaminantCategories).map(([key, category], i) => (
        <section
          key={key}
          className={clsx(
            "grid grid-rows-subgrid",
            key === "other"
              ? `col-start-3 row-start-5 row-end-8`
              : `col-start-${i + 1} row-start-1 row-end-8`,
          )}
        >
          <h1 className="text-black font-bold font-sans text-5xl tracking-tight mb-2 self-end">
            {category.name}
          </h1>
          <ul className={clsx("contents")} role="list">
            {category.contexts
              // .filter((key) => key !== "other")
              .map((ctxKey) => {
                const context = contaminantContexts[ctxKey];
                const Icon = context.icon;
                return (
                  <li
                    key={ctxKey}
                    className="grid grid-cols-[auto_1fr] w-full gap-x-3 items-start md:max-w-md"
                  >
                    <Icon
                      width={48}
                      height={48}
                      className={clsx(category.color, "-ml-1")}
                      aria-hidden
                    />
                    <div>
                      <strong className="font-sans text-lg md:text-xl font-medium text-black">
                        {context.name}
                      </strong>
                      {context.desc && (
                        <p className="mt-1 text-pretty text-neutral-600 font-mono text-xs leading-relaxed">
                          {context.desc}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </main>
  );
}
