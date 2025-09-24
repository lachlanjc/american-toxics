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
      <search className="w-full action-button mb-4">
        <input
          type="search"
          className="p-2 w-full outline-0"
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
      {!query ? children : null}
    </section>
  );
}
