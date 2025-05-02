"use client";
import { useState, useRef, useEffect } from "react";
import { handleSubmit } from "@/app/(map)/scoreboard/actions";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

export function SearchNearby() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<
    Array<{ id: string; place_name: string }>
  >([]);
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

  const handleSelect = (feature: { place_name: string }) => {
    setQuery(feature.place_name);
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <form action={handleSubmit} className="w-full">
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
