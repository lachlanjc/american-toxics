import type { Metadata } from "next";
import Link from "next/link";
import { categories } from "@/lib/data/site-categories";
import { supabase } from "@/lib/supabaseClient";
import { Count } from "@/lib/ui/count";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";

export const metadata: Metadata = {
  title: "Superfund Sites by Category",
  description:
    "Explore the most hazardous waste sites in the U.S. across different categories.",
};

export default async function CategoriesPage() {
  // sites with defined categories
  const { data, error } = await supabase
    .from("sites")
    .select("category, total:count()")
    .not("category", "is", null);
  const categoryKeys = Object.keys(categories)
    .filter((key) => key !== "unknown")
    .toSorted((a, b) => {
      const aCount = data?.find((record) => record.category === a)?.total ?? 0;
      const bCount = data?.find((record) => record.category === b)?.total ?? 0;
      return bCount - aCount;
    });
  if (error) {
    console.error("Error counting sites in categories", error);
  }
  return (
    <>
      <HeaderRoot>
        <HeaderTitle>Superfund Sites by Category</HeaderTitle>
        <HeaderSubtitle>
          These are the most common types of toxic waste sites in the U.S. This
          is not an official categorization, & many sites span multiple
          categories.
        </HeaderSubtitle>
      </HeaderRoot>
      <ul className="-mb-1 flex flex-col text-neutral-500">
        {categoryKeys.map((key) => {
          const category = categories[key as keyof typeof categories];
          const count =
            data?.find((record) => record.category === key)?.total ?? 0;
          const Icon = category.icon;
          return (
            <li
              className="group grid w-full grid-cols-[auto_1fr] items-center gap-x-3 py-3 md:max-w-md"
              key={key}
            >
              <Link className="contents" href={`/categories/${key}`}>
                <Icon
                  className={`${category.color} shrink-0`}
                  // style={{ width: Math.max(16, count / 5.5) }}
                />
                <div className="flex items-center gap-1">
                  <span
                    className="font-bold font-display text-black text-lg transition-colors group-hover:text-neutral-600"
                    style={{ viewTransitionName: key }}
                  >
                    {category.name}
                  </span>
                  <Count value={count} />
                </div>
                {category.desc && (
                  <p className="col-start-2 text-pretty">{category.desc}</p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
