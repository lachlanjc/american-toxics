"use client";
import { useState, useRef, useEffect, useActionState } from "react";
import { handleSubmit } from "@/app/(map)/scoreboard/actions";
import { MapZoom } from "./zoom";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  context: Array<{
    id: string;
    text: string;
    short_code?: string;
  }>;
}

interface Pin {
  coords: [number, number];
  place: [string, string, string];
}

function getPlaceFromMapbox(result: MapboxFeature): Pin {
  const name = result.place_name;
  const city =
    result?.context.find((c) => c.id.startsWith("place"))?.text || "";
  const state =
    result?.context
      .find((c) => c.id.startsWith("region"))
      ?.short_code?.replace("US-", "") || "";
  return {
    coords: result.center,
    place: [name, city, state],
  };
}

export function SearchNearby() {
  const [query, setQuery] = useState("");
  const [pin, setPin] = useState<Pin>({ coords: [0, 0], place: ["", "", ""] });
  const [results, setResults] = useState<Array<MapboxFeature>>([]);
  const [state, formAction, pending] = useActionState(handleSubmit, {});
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSelect = (feature: MapboxFeature) => {
    setQuery(feature.place_name);
    setPin(getPlaceFromMapbox(feature));
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <form
      action={formAction}
      onSubmit={() => {
        if (results.length > 0) {
          setPin(getPlaceFromMapbox(results?.[0]));
        }
        setResults([]);
      }}
      className="w-full"
    >
      {pin.coords?.[0] !== 0 && (
        <MapZoom
          center={pin.coords.toReversed() as [number, number]}
          zoom={7}
        />
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="flex-auto action-button relative">
          <input
            type="text"
            name="address"
            placeholder="Enter an address"
            className="p-2 w-full outline-none"
            autoFocus
            value={query}
            onChange={(e) => {
              // if (!MAPBOX_TOKEN) {
              //   console.warn("Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN");
              //   return;
              // }
              const query = e.currentTarget.value;
              setQuery(query);
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
                  if (data.features.length > 0) {
                    setPin(getPlaceFromMapbox(data.features?.[0]));
                  }
                })
                .catch((err) => {
                  if (err.name !== "AbortError") console.error(err);
                });
            }}
            ref={inputRef}
            disabled={pending}
            autoComplete="off"
          />
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
        </div>
        <button
          type="submit"
          disabled={pending}
          className="action-button p-2 shrink-0"
          aria-label="Submit"
        >
          &rarr;
        </button>
      </div>
      <input type="hidden" name="lat" value={pin.coords[1]} />
      <input type="hidden" name="lng" value={pin.coords[0]} />
      <input type="hidden" name="formatted" value={pin.place[0]} />
      <input type="hidden" name="city" value={pin.place[1]} />
      <input type="hidden" name="stateCode" value={pin.place[2]} />
    </form>
  );
}
