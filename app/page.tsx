"use client";

import { useEffect, useRef, useState } from "react";
import title from "title";
import { useChat } from "@ai-sdk/react";
import { SITES, Site } from "./sites";
import "mapbox-gl/dist/mapbox-gl.css";

import Map, { MapRef, Marker } from "react-map-gl/mapbox";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiaGFja2NsdWIiLCJhIjoiY2pscGI1eGdhMGRyNzN3bnZvbGY5NDBvZSJ9.Zm4Zduj94TrgU8h890M7gA";

const questions = [
  "What caused contamination here?",
  "What types of contaminants are present?",
  "How is cleanup progressing?",
  "Is it safe to be here?",
  "Provide a timeline of major events here",
];

const initialViewState = {
  latitude: SITES[0].lat,
  longitude: SITES[1].lng,
  zoom: 12,
  bearing: 0,
  pitch: 20,
};

function Chat({ site }: { site: Site }) {
  const { messages, setData, input, handleInputChange, handleSubmit, append } =
    useChat({ api: "/api/chat" });
  // Clear AI chat on site change
  useEffect(() => {
    setData(undefined);
  }, [site.id]);
  const suggestions = questions.filter(
    (q) =>
      !messages.some(
        (m) =>
          m.role === "user" &&
          m.parts.some((p) => p.type === "text" && p.text === q),
      ),
  );
  console.log(messages);
  return (
    <div className="main-card backdrop-blur-lg backdrop-saturate-150 flex flex-col w-full max-w-xl p-6 mx-auto stretch font-mono overflow-y-auto max-h-[80vh]">
      <header>
        <h1 className="text-balance font-bold font-sans text-3xl">
          {title(site.name)} Superfund Site
        </h1>
        <p className="opacity-70">{site.address}</p>
      </header>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`whitespace-pre-wrap even:mt-6 ${message.role === "user" ? "font-bold" : "opacity-70"} pr-8`}
        >
          {message.parts.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  <div key={`${message.id}-${i}`} className="text-pretty">
                    {part.text}
                  </div>
                );
            }
          })}
        </div>
      ))}

      <form onSubmit={handleSubmit} className="mt-auto w-full pt-8">
        {suggestions.length > 0 && (
          <div className="flex flex-col w-full mb-4">
            <strong>Suggested questions</strong>
            {suggestions.map((q) => (
              <button
                className="border-b border-zinc-300 last:border-b-0 text-zinc-600 text-xs py-2 text-left hover:opacity-80 transition-opacity cursor-pointer"
                type="button"
                key={q}
                onClick={() => {
                  append({ role: "user", content: q });
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}
        <input
          className="w-full action-button p-2"
          value={input}
          placeholder="Ask something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}

export default function Page() {
  const mapRef = useRef<MapRef | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [activeSite, setActiveSite] = useState<Site | null>(null);
  return (
    <div className="w-full h-full" ref={rootRef}>
      <style>{`.mapboxgl-canvas, .mapboxgl-marker { position: absolute !important; }`}</style>
      <Map
        ref={mapRef}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{
          width: "100%",
          height: "100vh",
          position: "absolute",
          inset: 0,
        }}
        cooperativeGestures
      >
        {SITES.sort((a, b) => b.lat - a.lat).map((marker, i) => (
          <Marker
            anchor="bottom"
            longitude={marker.lng}
            latitude={marker.lat}
            onClick={() => {
              setActiveSite(marker);
              mapRef.current?.flyTo({
                center: [marker.lng, marker.lat],
                zoom: 14,
                duration: 2000,
              });
            }}
            key={marker.id}
            style={{ position: "relative" }}
          >
            <svg
              className={
                activeSite?.id === marker.id
                  ? "fill-orange-300"
                  : "fill-orange-500"
              }
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))" }}
              width={32}
              height={32}
              viewBox="0 0 24 24"
            >
              <title>{marker.name}</title>
              <path
                d={`M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3 c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9 C20.1,15.8,20.2,15.8,20.2,15.7z`}
              />
            </svg>
          </Marker>
        ))}
      </Map>
      {activeSite && <Chat site={activeSite} />}
      {activeSite?.img && (
        <img
          src={activeSite.img}
          width={1097 / 3}
          height={1080 / 3}
          alt={activeSite.name}
          className="floating-image"
        />
      )}
    </div>
  );
}
