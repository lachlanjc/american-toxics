"use client";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { Search } from "@/app/(map)/sites/search";
import { SearchNearby } from "./search-nearby";

export default function SearchTabs() {
  return (
    <Tabs className="w-full">
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
        <Search />
      </TabPanel>
    </Tabs>
  );
}
