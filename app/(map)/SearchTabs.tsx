"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { Search } from "@/app/(map)/sites/search";
import { Link } from "next-view-transitions";

export default function SearchTabs() {
  return (
    <Tabs.Root defaultValue="search" className="w-full">
      <Tabs.List className="grid grid-cols-2 bg-black/10 p-1 gap-1 rounded-xl mb-4">
        <Tabs.Trigger
          value="search"
          className="active-tab px-4 py-2 text-neutral-700"
        >
          Search sites
        </Tabs.Trigger>
        <Tabs.Trigger
          value="nearby"
          className="active-tab px-4 py-2 text-neutral-700"
        >
          By address
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="nearby" className="">
        <form action="/scoreboard" method="POST">
          <search className="w-full action-button mb-4">
            <input
              type="search"
              name="address"
              placeholder="Enter an address"
              className="p-2 w-full outline-none"
              autoFocus
            />
          </search>
        </form>
      </Tabs.Content>

      <Tabs.Content value="search" className="">
        <Search>
          <p className="text-neutral-700 text-balance mb-3">
            This is a map of places with significant amounts of dangerous
            toxic&nbsp;waste in the U.S.
          </p>
          <p className="text-neutral-700 text-balance mb-3">
            The Environment Protection Agency (EPA) designates them “Superfund
            sites,” and manages cleaning them up.
          </p>
          <p>
            <Link href="/about" className="text-primary font-medium font-sans">
              Read more →
            </Link>
          </p>
        </Search>
      </Tabs.Content>
    </Tabs.Root>
  );
}
