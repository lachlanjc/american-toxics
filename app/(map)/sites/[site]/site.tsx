"use client";
import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useFocusable } from "@/lib/util/use-focusable";
import { hasPlainSiteImage, nplStatuses, type Site } from "@/lib/data/site";
import { Link } from "next-view-transitions";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { Root as Portal } from "@radix-ui/react-portal";
import { WellRoot } from "@/lib/ui/well";
import reactStringReplace from "react-string-replace";
import { UIMessage } from "@ai-sdk/ui-utils";

const questions = [
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

function AITextHighlight({
  text,
  onQuery,
}: {
  text: string;
  onQuery: (query: string) => void;
}) {
  return (
    <u
      className={
        "decoration-dotted decoration-primary underline-offset-3 cursor-zoom-in"
      }
      onClick={() => {
        const is =
          text.includes("and") || text.endsWith("s") || text.endsWith("s)")
            ? "are"
            : "is";
        const topic = text.replace(/\s\(.+\)$/, "");
        onQuery(`What ${is} ${topic}?`);
      }}
    >
      {deasterisk(text)}
    </u>
  );
}

const markRegex = /\*([^*]{3,})\*/g;
const boldRegex = /\*\*(.{5,})\*\*/g;
const deasterisk = (txt: string) => txt.replaceAll(/\*/g, "").trim();
function AIText({
  message,
  onQuery,
}: {
  message: UIMessage;
  onQuery: (query: string) => void;
}) {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part, i) => {
      const markText = (text: string | Array<React.ReactNode>) =>
        reactStringReplace(text, markRegex, (match: string) => {
          // console.log("mark", match);
          return <AITextHighlight text={match} onQuery={onQuery} key={match} />;
        });
      const bolded = reactStringReplace(
        part.text,
        boldRegex,
        (match: string) => {
          return <strong key={match}>{markText(match)}</strong>;
        },
      );
      const marked = markText(bolded);
      return (
        <div data-text={part.text} key={`part-${i}`}>
          {marked}
        </div>
      );
    });
}

function SiteDescription({
  site,
  onQuery,
}: {
  site: Site;
  onQuery: (query: string) => void;
}) {
  const { messages, append } = useChat({
    api: `/api/chat/${site.id}`,
  });
  useEffect(() => {
    if (messages.length === 0) {
      append({
        role: "user",
        content:
          "Summarize what happened at this site in 3 sentences, emphasizing what caused contamination. Skip including the name of the site or its city/state.",
      });
    }
  }, [site.id, append]);
  return (
    <section className="mt-6 pr-8">
      {messages
        .filter((msg) => msg.role === "assistant")
        .map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap text-neutral-600`}
          >
            <AIText message={message} onQuery={onQuery} />
          </div>
        ))}
    </section>
  );
}

export function SiteCard({
  site,
  children,
}: React.PropsWithChildren<{ site: Site }>) {
  const ref = useFocusable();
  const {
    messages,
    setData,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    append,
  } = useChat({ api: `/api/chat/${site.id}` });
  // Clear AI chat on site change
  useEffect(() => {
    setData(undefined);
  }, [site.id, setData]);
  const suggestions = questions.filter(
    (q) =>
      !messages.some(
        (m) =>
          m.role === "user" &&
          m.parts.some((p) => p.type === "text" && p.text === q),
      ),
  );
  // console.log(messages);
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
            className="underline underline-offset-3 hover:text-primary transition-colors"
          >
            <abbr title={site.stateName} className="no-underline">
              {site.stateCode}
            </abbr>
          </Link>{" "}
          ({site.county} County)
        </HeaderSubtitle>
      </HeaderRoot>
      <SiteNPLStatusTimeline site={site} />
      {children}
      <SiteDescription
        site={site}
        onQuery={(q) => {
          setInput(q);
          ref.current?.focus();
          ref.current?.setSelectionRange(q.length, q.length);
        }}
      />
      <section>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap odd:mt-6 ${message.role === "user" ? "font-bold font-sans text-lg mb-1" : "text-neutral-600"} pr-8`}
          >
            <AIText
              message={message}
              onQuery={(q) => {
                setInput(q);
                ref.current?.focus();
              }}
            />
          </div>
        ))}
      </section>

      {suggestions.length > 0 && (
        <div className="flex flex-col w-full mt-8">
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
      <form
        onSubmit={handleSubmit}
        className="mt-auto w-full pt-6 sticky bottom-0"
      >
        <input
          className="w-full action-button p-2 !bg-white"
          value={input}
          placeholder="Ask something..."
          onChange={handleInputChange}
          ref={ref}
        />
      </form>
    </>
  );
}
