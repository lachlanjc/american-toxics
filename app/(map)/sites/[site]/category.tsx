import { SupabaseSite } from "@/lib/data/site";
import { categories } from "@/lib/data/site-categories";
import clsx from "clsx";
import Link from "next/link";

export function CategoryChip({
  category: key,
  className,
}: {
  category: SupabaseSite["category"];
  className?: string;
}) {
  const category = categories[key as keyof typeof categories];
  const CategoryIcon = category?.icon;
  return (
    <Link
      href={`/categories/${key}`}
      className={clsx(
        "flex items-center gap-1.5 w-fit rounded-full pl-2 pr-2.5 py-0.75",
        "font-sans text-base font-medium tracking-normal",
        "text-neutral-800 border border-black/10 bg-black/5 transition-colors",
        className,
      )}
      style={{ viewTransitionName: key || undefined }}
    >
      {CategoryIcon && (
        <CategoryIcon className={clsx(category.color)} width={20} height={20} />
      )}
      <span className="text-trim-both">{category.name}</span>
    </Link>
  );
}
