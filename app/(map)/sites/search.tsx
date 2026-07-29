"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useFocusable } from "@/lib/util/use-focusable";
import { useFuse } from "@/lib/util/use-fuse";
import { SiteList, type SiteListSite } from "./list";

export const searchOptions = {
  keys: ["name", "stateCode", "stateName", "city", "county"],
};

export function Search({ children }: React.PropsWithChildren<object>) {
  type SearchableSite = SiteListSite & {
    stateName?: string;
    county?: string;
  };
  const [sites, setSites] = useState<Array<SearchableSite>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { results, handleSearch, query, isPending } = useFuse({
    data: sites,
    options: searchOptions,
  });
  const ref = useFocusable();

  useEffect(() => {
    let isActive = true;
    const loadSites = async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("id, name, npl, city, stateCode, stateName, county, category")
        .order("name", { ascending: true });
      if (!isActive) {
        return;
      }
      setSites(error || !data ? [] : data);
      setIsLoading(false);
    };
    loadSites();
    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section>
      <search className="action-button mb-4 w-full">
        <input
          className="w-full p-2 outline-0"
          disabled={isLoading}
          onChange={handleSearch}
          placeholder="Search by County, City, State, or Site Name"
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
