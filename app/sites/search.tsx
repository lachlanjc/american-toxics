import { useFuse } from "@/lib/util/use-fuse";
import { SiteList } from "./list";
import { Site } from "@/lib/data/site";

const searchOptions = {
  keys: ["name", "stateCode", "stateName", "city", "county"],
};

export function Search({
  sites,
  onSelect,
}: {
  sites: Site[];
  onSelect: (site: Site) => void;
}) {
  const { results, handleSearch, query, isPending } = useFuse({
    data: sites,
    options: searchOptions,
  });

  return (
    <section>
      <search className="w-full action-button my-4">
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
          onSelect={(site) => onSelect(site)}
          sites={results}
        />
      )}
    </section>
  );
}
