"use client";
import { allSites } from "@/lib/data/api";
import { useFocusable } from "@/lib/util/use-focusable";
import { useFuse } from "@/lib/util/use-fuse";
import { SiteList } from "./list";

export const searchOptions = {
  keys: ["name", "stateCode", "stateName", "city", "county"],
};

export function Search({ children }: React.PropsWithChildren<object>) {
  const { results, handleSearch, query, isPending } = useFuse({
    data: allSites,
    options: searchOptions,
  });
  const ref = useFocusable();

  return (
    <section>
      <search className="action-button mb-4 w-full">
        <input
          className="w-full p-2 outline-0"
          onChange={handleSearch}
          placeholder="Search by county, city, state, or site name"
          ref={ref}
          type="search"
          value={query}
        />
      </search>
      {results.length > 0 && (
        <SiteList
          className={`${isPending ? "opacity-50" : ""} transition-opacity`}
          sites={results}
        />
      )}
      {query ? null : children}
    </section>
  );
}
