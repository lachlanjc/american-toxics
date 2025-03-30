"use client";

import { useChat } from "@ai-sdk/react";

const questions = [
  "What caused contamination here?",
  "What types of contaminants are present?",
  "How is cleanup progressing?",
  "Is it safe to be here?",
  "Provide a timeline of major events here",
];

function Chat() {
  const { messages, input, handleInputChange, handleSubmit, setInput } =
    useChat({
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
          Intersil Superfund Site
        </h1>
        <p className="opacity-70">10910 N Tantau Ave, Cupertino, CA 95014</p>
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
                key={q}
                onClick={() => setInput(q)}
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
  return (
    <div className="w-full h-64 mt-4">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        src={`https://www.openstreetmap.org/export/embed.html?bbox=-122.010449%2C37.32877%2C-122.006049%2C37.33317&layer=mapnik&marker=37.33097%2C-122.008249`}
        className="absolute inset-0"
        style={{ border: 0 }}
      />
      <Chat />
      <img
        src="https://images.squarespace-cdn.com/content/v1/58ebbc06e3df28b2c2c8b70b/1492647479383-E3O05VFYOUE8Y7AOFJZK/Superfunds-7.jpg"
        width={1097 / 3}
        height={1080 / 3}
        alt="Intersil now"
        className="floating-image"
      />
    </div>
  );
}
