"use client";
import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useFocusable } from "@/lib/util/use-focusable";
import { hasPlainSiteImage, nplStatuses, type Site } from "@/lib/data/site";
import { Link } from "next-view-transitions";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { Root as Portal } from "@radix-ui/react-portal";
import { WellRoot } from "@/lib/ui/well";

const questions = [
  "What happened here?",
  "What types of contaminants are present?",
  "How is cleanup progressing? Is it safe to be here?",
  "Who is funding this cleanup?",
  "Provide a timeline of major events here",
];

const formatDate = (dateString?: string) => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Invalid date format:", dateString, error);
    return null;
  }
};

function SiteNPLStatusTimeline({ site }: { site: Site }) {
  return (
    <WellRoot className="pt-4">
      <ul className="flex flex-col gap-1 text-sm @md:flex-row @md:justify-between @md:px-4">
        {Object.keys(nplStatuses).map((statusKey) => {
          const status = nplStatuses[statusKey as keyof typeof nplStatuses];
          const value = site[status.field] as string | undefined;
          return (
            <li
              key={statusKey}
              className="flex gap-x-2 @md:flex-col items-baseline @md:items-center"
            >
              <div className={`${status.color} shrink-0 @md:mb-1 self-center`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  width="20"
                  height="20"
                >
                  {value ? (
                    <path
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      fill="currentColor"
                      fillRule="evenodd"
                      clipRule="evenodd"
                    />
                  ) : (
                    <circle
                      cx="10"
                      cy="10"
                      r="6"
                      stroke="currentColor"
                      strokeWidth={2}
                      fill="transparent"
                    />
                  )}
                </svg>
              </div>
              <div
                className={`font-sans text-base ${value ? "font-medium" : "text-neutral-500"}`}
              >
                {status.label}
              </div>
              <small className="text-neutral-500">{formatDate(value)}</small>
            </li>
          );
        })}
      </ul>
    </WellRoot>
  );
}

export function SiteCard({
  site,
  children,
}: React.PropsWithChildren<{ site: Site }>) {
  const ref = useFocusable();
  const { messages, setData, input, handleInputChange, handleSubmit, append } =
    useChat({ api: `/api/chat/${site.id}` });
  // Clear AI chat on site change
  useEffect(() => {
    setData(undefined);
    if (messages.length === 0) append({ role: "user", content: questions[0] });
  }, [site.id, setData]);
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
      {hasPlainSiteImage(site.id) && (
        <Portal>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/plainsite/${site.id}.jpg`}
            width={1097 / 4}
            height={1080 / 4}
            className="floating-image"
            alt={`Plain Site of ${site.name}`}
          />
        </Portal>
      )}
      <HeaderRoot showClose>
        <HeaderTitle style={{ viewTransitionName: site.id }}>
          {site.name} Superfund Site
        </HeaderTitle>
        <HeaderSubtitle>
          {site.city},{" "}
          <Link
            href={`/states/${site.stateCode}`}
            className="underline underline-offset-2"
          >
            <abbr title={site.stateName}>{site.stateCode}</abbr>
          </Link>{" "}
          ({site.county} County)
        </HeaderSubtitle>
      </HeaderRoot>
      <SiteNPLStatusTimeline site={site} />
      {children}
      <section>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap odd:mt-6 ${message.role === "user" ? "font-bold font-sans text-lg mb-1" : "text-neutral-600"} pr-8`}
          >
            {message.parts.map((part, i) => {
              switch (part.type) {
                case "text":
                  return (
                    <div key={`${message.id}-${i}`} className="text-pretty">
                      {part.text.replaceAll("**", "")}
                    </div>
                  );
              }
            })}
          </div>
        ))}
      </section>

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
          ref={ref}
        />
      </form>
    </>
  );
}
