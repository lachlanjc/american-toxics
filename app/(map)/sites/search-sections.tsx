"use client";

import { SiteList } from "@/app/(map)/sites/list";
import { searchOptions } from "@/app/(map)/sites/search";
import type { SupabaseSite } from "@/lib/data/site";
import { Heading } from "@/lib/ui/typography";
import { useFocusable } from "@/lib/util/use-focusable";
import { useFuse } from "@/lib/util/use-fuse";

interface Section {
  key: string;
  label: string;
  sites: Array<
    Pick<
      SupabaseSite,
      "id" | "name" | "npl" | "city" | "stateCode" | "category"
    > &
      Partial<Pick<SupabaseSite, "category">>
  >;
}

export function SearchableSections({ sections }: { sections: Section[] }) {
  // Flatten sites for searching
  const allItems = sections.flatMap((section) => section.sites);
  const { results, handleSearch, query, isPending } = useFuse({
    data: allItems,
    options: searchOptions,
  });
  const ref = useFocusable();

  return (
    <article className="">
      <search className="w-full action-button mb-5">
        <input
          type="search"
          className="p-2 w-full outline-none"
          value={query}
          placeholder="Search by county, city, state, or site name"
          onChange={handleSearch}
          ref={ref}
        />
      </search>
      {results.length > 0 && (
        <SiteList
          className={`${isPending ? "opacity-50" : ""} transition-opacity`}
          sites={results}
        />
      )}
      {!query && (
        <>
          {sections.map((section) => (
            <section id={section.key} key={section.key} className="mb-6">
              <Heading>{section.label}</Heading>
              <SiteList className="mb-4" sites={section.sites} />
            </section>
          ))}
        </>
      )}
    </article>
  );
}
