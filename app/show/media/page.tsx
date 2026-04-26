import clsx from "clsx";
import {
  contaminantCategories,
  contaminantContexts,
} from "@/lib/data/contaminants";

export const metadata = { title: "Contexts" };

export default function Page() {
  return (
    <main className="mx-auto grid w-fit grid-cols-3 grid-rows-[auto_repeat(8,auto)] gap-x-16 gap-y-8 px-12 pt-8">
      {Object.entries(contaminantCategories).map(([key, category], i) => (
        <section
          className={clsx(
            "grid grid-rows-subgrid",
            key === "other"
              ? "col-start-3 row-start-5 row-end-8"
              : `col-start-${i + 1} row-start-1 row-end-8`
          )}
          key={key}
        >
          <h1 className="mb-2 self-end font-bold font-display text-5xl text-black tracking-tight">
            {category.name}
          </h1>
          <ul className={clsx("contents")}>
            {category.contexts
              // .filter((key) => key !== "other")
              .map((ctxKey) => {
                const context = contaminantContexts[ctxKey];
                const Icon = context.icon;
                return (
                  <li
                    className="grid w-full grid-cols-[auto_1fr] items-start gap-x-3 md:max-w-md"
                    key={ctxKey}
                  >
                    <Icon
                      aria-hidden
                      className={clsx(category.color, "-ml-1")}
                      height={48}
                      width={48}
                    />
                    <div>
                      <strong className="font-medium font-sans text-black text-lg md:text-xl">
                        {context.name}
                      </strong>
                      {context.desc && (
                        <p className="mt-1 text-pretty font-mono text-neutral-600 text-sm leading-relaxed">
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
