"use client";
import * as Tabs from "@radix-ui/react-tabs";
import { Search } from "@/app/(map)/sites/search";
import { Link } from "next-view-transitions";
import { useState, useEffect, useRef } from "react";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

function AddressAutocomplete() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!MAPBOX_TOKEN) {
      console.warn("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
      return;
    }
    if (query.length < 3) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        query,
      )}.json?autocomplete=true&types=address&country=us&limit=5&access_token=${MAPBOX_TOKEN}`,
      { signal: controller.signal },
    )
      .then((res) => res.json())
      .then((data) => {
        setResults(data.features || []);
      })
      .catch((err) => {
        if (err.name !== "AbortError") console.error(err);
      });
    return () => controller.abort();
  }, [query]);

  const handleSelect = (feature: any) => {
    setQuery(feature.place_name);
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <form action="/scoreboard" method="POST" className="w-full">
      <div className="w-full action-button relative">
        <input
          type="text"
          name="address"
          placeholder="Enter an address"
          className="p-2 w-full outline-none"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          ref={inputRef}
        />
      </div>
      {results.length > 0 && (
        // This is an a11y nightmare, I'll fix later
        <ul className="bg-black/10 p-1 gap-1 rounded-b-xl w-full -mt-1 pt-2 max-h-60 overflow-auto">
          {results.map((feature) => (
            <li
              key={feature.id}
              className="p-2 active-tab cursor-pointer truncate"
              onClick={() => handleSelect(feature)}
            >
              {feature.place_name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
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
        <AddressAutocomplete />
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
