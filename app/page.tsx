"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

const questions = [
  "What caused contamination here?",
  "What types of contaminants are present?",
  "How is cleanup progressing?",
  "Is it safe to be here?",
  "Provide a timeline of major events here",
];

interface Site {
  id: number;
  name: string;
  address: string;
  img: string;
  lat: number;
  lng: number;
}

const SITES: Site[] = [
  {
    id: 43360032,
    name: "Intersil/Siemens",
    address: "10910 N Tantau Ave, Cupertino, CA 95014",
    img: "/plainsite/CAD041472341.jpg",
    lat: 37.33097,
    lng: -122.008249,
  },
];

function Chat({ site }: { site: Site }) {
  const { messages, input, handleInputChange, handleSubmit, append } = useChat({
    api: "/api/chat",
  });
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
        <h1 className="font-bold font-sans text-3xl">
          {site.name} Superfund Site
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
  const [activeSite, setActiveSite] = useState(SITES[0]);
  return (
    <div className="w-full h-64 mt-4">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=-122.010449%2C37.32877%2C-122.006049%2C37.33317&layer=mapnik&marker=${activeSite.lat}%2C${activeSite.lng}`}
        className="absolute inset-0"
        style={{ border: 0 }}
      />
      {activeSite && <Chat site={activeSite} />}
      {activeSite && (
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
