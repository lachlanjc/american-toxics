import clsx from "clsx";
import Link from "next/link";
import type { SupabaseSite } from "@/lib/data/site";
import { categories } from "@/lib/data/site-categories";

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
      className={clsx(
        "flex w-fit items-center gap-1.5 rounded-full py-0.75 pr-2.5 pl-2",
        "font-semibold font-sans text-base tracking-normal",
        "border border-black/10 bg-black/5 text-neutral-800 transition-colors",
        className
      )}
      href={`/categories/${key}`}
      style={{ viewTransitionName: key || undefined }}
    >
      {CategoryIcon && (
        <CategoryIcon className={clsx(category.color)} height={20} width={20} />
      )}
      <span className="text-trim-both">{category.name}</span>
    </Link>
  );
}
