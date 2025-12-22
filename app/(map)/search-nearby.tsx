"use client";
import { Autocomplete } from "@base-ui/react/autocomplete";
import { useActionState, useRef, useState } from "react";
import { handleSubmit } from "@/app/(map)/scoreboard/actions";
import ArrowRight from "@/lib/icons/ArrowRight";
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
  const requestRef = useRef<AbortController | null>(null);
  const skipFetchRef = useRef(false);
  const hasPin = pin.coords[0] !== 0 || pin.coords[1] !== 0;

  const handleSelect = (feature: MapboxFeature) => {
    skipFetchRef.current = true;
    requestRef.current?.abort();
    setQuery(feature.place_name);
    setPin(getPlaceFromMapbox(feature));
    setResults([]);
  };

  const fetchResults = async (search: string) => {
    if (!MAPBOX_TOKEN) {
      setResults([]);
      return;
    }
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          search
        )}.json?autocomplete=true&types=address&country=us&limit=5&access_token=${MAPBOX_TOKEN}`,
        { signal: controller.signal }
      );
      if (!response.ok) {
        setResults([]);
        return;
      }
      const data = await response.json();
      if (controller.signal.aborted || !Array.isArray(data.features)) {
        return;
      }
      setResults(data.features);
      if (data.features[0]) {
        setPin(getPlaceFromMapbox(data.features[0]));
      }
    } catch (error: unknown) {
      if (
        controller.signal.aborted ||
        (error instanceof DOMException && error.name === "AbortError")
      ) {
        return;
      }
      setResults([]);
    }
    requestRef.current = null;
  };

  return (
    <form
      action={formAction}
      className="w-full"
      onSubmit={(event) => {
        if (!hasPin) {
          event.preventDefault();
          if (results[0]) {
            const nextPin = getPlaceFromMapbox(results[0]);
            setPin(nextPin);
            setQuery(results[0].place_name);
          }
          setResults([]);
          return;
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
      <div className="flex items-start gap-2">
        <Autocomplete.Root
          autoHighlight="always"
          items={results}
          itemToStringValue={(feature) => feature.place_name}
          keepHighlight
          mode="none"
          onOpenChange={(open) => {
            if (!open) {
              setResults([]);
            }
          }}
          onValueChange={(value) => {
            if (skipFetchRef.current) {
              skipFetchRef.current = false;
              return;
            }
            setQuery(value);
            if (value.length < 3) {
              requestRef.current?.abort();
              setResults([]);
              return;
            }
            fetchResults(value);
          }}
          open={results.length > 0}
          value={query}
        >
          <div className="action-button relative w-full flex-auto">
            <label className="sr-only" htmlFor="nearby-address">
              Search address
            </label>
            <Autocomplete.Input
              autoComplete="off"
              autoFocus
              className="w-full p-2 outline-none"
              disabled={pending}
              id="nearby-address"
              name="address"
              placeholder="Enter an address"
              type="text"
            />
            <Autocomplete.Portal>
              <Autocomplete.Positioner className="z-10">
                <Autocomplete.Popup
                  className="mt-1 w-(--anchor-width) overflow-hidden rounded-xl bg-black/90 shadow-xl"
                  data-appearance="dark"
                >
                  <Autocomplete.List className="max-h-60 overflow-auto p-1 font-mono text-xs">
                    {(feature: MapboxFeature) => (
                      <Autocomplete.Item
                        className="tab cursor-pointer truncate p-2 hover:bg-white/20 data-[highlighted]:bg-white/20 data-[highlighted]:text-neutral-900"
                        key={feature.id}
                        onSelect={() => handleSelect(feature)}
                        value={feature}
                      >
                        {feature.place_name?.replace(", United States", "")}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.List>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </div>
        </Autocomplete.Root>
        <button
          aria-label="Submit"
          className="action-button inline-flex aspect-square h-[42px] shrink-0 items-center justify-center"
          disabled={pending || !hasPin}
          type="submit"
        >
          <ArrowRight aria-hidden />
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
