"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { SearchNearby } from "./search-nearby";

const SearchPanel = dynamic(() =>
  import("@/app/(map)/sites/search").then((mod) => ({ default: mod.Search }))
);

export default function SearchTabs() {
  const [selectedKey, setSelectedKey] = useState<string>("nearby");

  return (
    <Tabs
      className="w-full"
      onSelectionChange={(key) => setSelectedKey(String(key))}
      selectedKey={selectedKey}
    >
      <TabList className="mb-4 grid grid-cols-2 gap-1 rounded-xl bg-black/10 p-1 text-center font-medium font-sans text-base text-neutral-700">
        <Tab
          className="active-tab px-4 py-3 text-trim-both data-[selected]:text-neutral-900"
          id="nearby"
        >
          Near address
        </Tab>
        <Tab
          className="active-tab px-4 py-3 text-trim-both data-[selected]:text-neutral-900"
          id="search"
        >
          Search sites
        </Tab>
      </TabList>

      <TabPanel className="" id="nearby">
        <SearchNearby />
        <p className="mt-5 mb-3 text-balance text-neutral-700">
          This is a map of places with significant amounts of dangerous
          toxic&nbsp;waste in the U.S.
        </p>
        <p className="text-balance text-neutral-700">
          The Environment Protection Agency (EPA) designates them “Superfund
          sites,” and manages cleaning them up.
        </p>
      </TabPanel>

      <TabPanel className="" id="search">
        {selectedKey === "search" ? <SearchPanel /> : null}
      </TabPanel>
    </Tabs>
  );
}
