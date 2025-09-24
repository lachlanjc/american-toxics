"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { SearchNearby } from "./search-nearby";

const SearchPanel = dynamic(() =>
  import("@/app/(map)/sites/search").then((mod) => ({ default: mod.Search })),
);

export default function SearchTabs() {
  const [selectedKey, setSelectedKey] = useState<string>("nearby");

  return (
    <Tabs
      className="w-full"
      selectedKey={selectedKey}
      onSelectionChange={(key) => setSelectedKey(String(key))}
    >
      <TabList className="grid grid-cols-2 bg-black/10 p-1 gap-1 rounded-xl mb-4 font-sans font-medium text-neutral-700 text-base text-center">
        <Tab
          id="nearby"
          className="active-tab px-4 py-3 text-trim-both data-[selected]:text-neutral-900"
        >
          Near address
        </Tab>
        <Tab
          id="search"
          className="active-tab px-4 py-3 text-trim-both data-[selected]:text-neutral-900"
        >
          Search sites
        </Tab>
      </TabList>

      <TabPanel id="nearby" className="">
        <SearchNearby />
        <p className="text-neutral-700 text-balance mb-3 mt-5">
          This is a map of places with significant amounts of dangerous
          toxic&nbsp;waste in the U.S.
        </p>
        <p className="text-neutral-700 text-balance">
          The Environment Protection Agency (EPA) designates them “Superfund
          sites,” and manages cleaning them up.
        </p>
      </TabPanel>

      <TabPanel id="search" className="">
        {selectedKey === "search" ? <SearchPanel /> : null}
      </TabPanel>
    </Tabs>
  );
}
