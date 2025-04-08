"use client";
import { useFuse } from "@/lib/util/use-fuse";
import { allSites } from "@/lib/data/api";
import { SiteList } from "./list";

const searchOptions = {
  keys: ["name", "stateCode", "stateName", "city", "county"],
};

export function Search({ children }: React.PropsWithChildren<{}>) {
  const { results, handleSearch, query, isPending } = useFuse({
    data: allSites,
    options: searchOptions,
  });

  return (
    <section>
      <search className="w-full action-button mb-4">
        <input
          type="search"
          className="p-2 w-full outline-0"
          value={query}
          placeholder="Search by county, city, state, or site name"
          onChange={handleSearch}
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
