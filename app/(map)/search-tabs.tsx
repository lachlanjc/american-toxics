"use client";

import { Tabs } from "@base-ui/react/tabs";
import dynamic from "next/dynamic";
import { useState } from "react";
import { SearchNearby } from "./search-nearby";

const SearchPanel = dynamic(() =>
  import("@/app/(map)/sites/search").then((mod) => ({ default: mod.Search }))
);

export default function SearchTabs() {
  const [selectedKey, setSelectedKey] = useState("nearby");

  return (
    <Tabs.Root
      className="w-full"
      onValueChange={(value) => setSelectedKey(String(value))}
      value={selectedKey}
    >
      <Tabs.List className="relative mb-4 grid grid-cols-2 gap-1 rounded-xl bg-black/10 p-1 text-center font-medium font-sans text-base text-neutral-700">
        <Tabs.Indicator className="tab-indicator absolute top-0 left-0 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) rounded-lg bg-white shadow transition-transform duration-200 ease-in-out" />
        <Tabs.Tab className="tab px-4 py-2 text-trim-both" value="nearby">
          Near Address
        </Tabs.Tab>
        <Tabs.Tab className="tab px-4 py-2 text-trim-both" value="search">
          Search Sites
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel keepMounted value="nearby">
        <SearchNearby />
        <p className="mt-5 mb-3 text-balance text-neutral-700">
          This is a map of places with significant amounts of dangerous
          toxic&nbsp;waste in the U.S.
        </p>
        <p className="text-balance text-neutral-700">
          The Environment Protection Agency (EPA) designates them “Superfund
          sites,” and manages cleaning them up.
        </p>
      </Tabs.Panel>

      <Tabs.Panel keepMounted value="search">
        {selectedKey === "search" ? <SearchPanel /> : null}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
