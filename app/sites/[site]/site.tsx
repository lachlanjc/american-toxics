"use client";
import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { type Site } from "@/lib/data/site";
import Link from "next/link";

const questions = [
  "What caused contamination here?",
  "What types of contaminants are present?",
  "How is cleanup progressing?",
  "Is it safe to be here?",
  "Provide a timeline of major events here",
];

export function SiteCard({ site }: { site: Site }) {
  const { messages, setData, input, handleInputChange, handleSubmit, append } =
    useChat({ api: `/api/chat/${site.id}` });
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
    <>
      <header>
        <p className="opacity-70">
          {site.city},{" "}
          <Link href={`/states/${site.stateCode}`}>{site.stateCode}</Link> (
          {site.county} County)
        </p>
      </header>
      {messages.map((message) => (
        <div
          key={message.id}
          className={`whitespace-pre-wrap even:mt-6 ${message.role === "user" ? "font-bold font-sans" : "opacity-70"} pr-8`}
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
    </>
  );
}
