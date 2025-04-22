import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { Link } from "next-view-transitions";
import { Count } from "@/lib/ui/count";
import { categories } from "@/lib/data/site-categories";
import { supabase } from "@/lib/supabaseClient";

export function metadata() {
  return {
    title: "Superfund Sites by Category",
    description:
      "Explore the most hazardous waste sites in the U.S. across different categories.",
  };
}

export default async function CategoriesPage() {
  // sites with defined categories
  const { data, error } = await supabase
    .from("sites")
    .select("category, total:count()")
    .not("category", "is", null);
  const categoryKeys = Object.keys(categories)
    .filter((key) => !["other"].includes(key))
    .sort((a, b) => {
      const aCount = data?.find((record) => record.category === a)?.total ?? 0;
      const bCount = data?.find((record) => record.category === b)?.total ?? 0;
      return bCount - aCount;
    });
  if (error) {
    console.error("Error counting sites in categories", error);
  }
  return (
    <>
      <HeaderRoot showClose>
        <HeaderTitle>Superfund Sites by Category</HeaderTitle>
        <HeaderSubtitle>
          Superfund sites can be caused by hazardous manufacturing, improper
          disposal, or use of toxic chemicals. This is not an official
          categorization.
        </HeaderSubtitle>
      </HeaderRoot>
      <ul className="-mb-1 text-neutral-500 gap-4 flex flex-col" role="list">
        {categoryKeys.map((key) => {
          const category = categories[key as keyof typeof categories];
          const count =
            data?.find((record) => record.category === key)?.total ?? 0;
          const Icon = category.icon;
          return (
            <li
              key={key}
              role="listitem"
              className="grid grid-cols-[auto_1fr] w-full gap-x-4 gap-y-1 group items-center md:max-w-md py-2"
            >
              <Link href={`/categories/${key}`} className="contents">
                <Icon
                  className={`${category.color} shrink-0`}
                  // style={{ width: Math.max(16, count / 5.5) }}
                />
                <div className="flex items-center gap-2">
                  <span
                    className="font-sans text-lg md:text-2xl font-medium text-black transition-colors group-hover:text-neutral-600"
                    style={{ viewTransitionName: key }}
                  >
                    {category.name}
                  </span>
                  <Count value={count} />
                </div>
                {category.desc && (
                  <p className="col-start-2 text-balance">{category.desc}</p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
