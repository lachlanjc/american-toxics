"use client";
import { useActionState, useRef, useState } from "react";
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
  const [, formAction, pending] = useActionState(handleSubmit, {});
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
      className="w-full"
      onSubmit={() => {
        if (results.length > 0) {
          setPin(getPlaceFromMapbox(results?.[0]));
        }
        setResults([]);
      }}
    >
      {pin.coords?.[0] !== 0 && (
        <MapZoom
          center={pin.coords.toReversed() as [number, number]}
          zoom={7}
        />
      )}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="action-button relative flex-auto">
          <input
            autoComplete="off"
            autoFocus
            className="w-full p-2 outline-none"
            disabled={pending}
            name="address"
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
                  query
                )}.json?autocomplete=true&types=address&country=us&limit=5&access_token=${MAPBOX_TOKEN}`,
                { signal: controller.signal }
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
            placeholder="Enter an address"
            ref={inputRef}
            type="text"
            value={query}
          />
          {results.length > 0 && (
            // This is an a11y nightmare, I'll fix later
            <ul className="-mt-1 max-h-60 w-full gap-1 overflow-auto rounded-b-xl bg-black/10 p-1 pt-2">
              {results.map((feature) => (
                <li
                  className="active-tab cursor-pointer truncate p-2"
                  key={feature.id}
                  onClick={() => handleSelect(feature)}
                >
                  {feature.place_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button
          aria-label="Submit"
          className="action-button shrink-0 p-2"
          disabled={pending}
          type="submit"
        >
          &rarr;
        </button>
      </div>
      <input name="lat" type="hidden" value={pin.coords[1]} />
      <input name="lng" type="hidden" value={pin.coords[0]} />
      <input name="formatted" type="hidden" value={pin.place[0]} />
      <input name="city" type="hidden" value={pin.place[1]} />
      <input name="stateCode" type="hidden" value={pin.place[2]} />
    </form>
  );
}
