"use client";
import { useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { useFocusable } from "@/lib/util/use-focusable";
import { hasPlainSiteImage, Site, SupabaseSite } from "@/lib/data/site";
import { Link } from "next-view-transitions";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { Root as Portal } from "@radix-ui/react-portal";
import reactStringReplace from "react-string-replace";
import { UIMessage } from "@ai-sdk/ui-utils";
import { OpenAIIcon } from "@/lib/ui/icons";
import { CategoryChip } from "./category";
import { formatAcres } from "@/lib/util/distance";

const questions = [
  "What types of contaminants are present?",
  "How is cleanup progressing? Is it safe to be here?",
  "Who is funding this cleanup?",
  "Provide a timeline of major events here",
];

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
        reactStringReplace(text, markRegex, (match: string, i: number) => {
          return (
            <AITextHighlight
              text={match}
              onQuery={onQuery}
              key={[match, i].join("")}
            />
          );
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
  site: SupabaseSite;
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
    <section className="mb-6 pr-8">
      {messages
        .filter((msg) => msg.role === "assistant")
        .map((message) => (
          <div
            key={message.id}
            className={`whitespace-pre-wrap text-neutral-600 min-h-16`}
          >
            <AIText message={message} onQuery={onQuery} />
          </div>
        ))}
      <div className="flex items-center gap-2.5 mt-2 text-neutral-500 text-xs">
        <OpenAIIcon className="w-5 h-5" />
        EPA information summarized by GPT-4.1
      </div>
    </section>
  );
}

export function SiteCard({
  site,
  children,
}: React.PropsWithChildren<{ site: SupabaseSite }>) {
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
            <abbr title={site.stateName ?? ""} className="no-underline">
              {site.stateCode}
            </abbr>
          </Link>{" "}
          ({site.county} County)
        </HeaderSubtitle>
      </HeaderRoot>
      <dl className="grid grid-cols-2 mb-4">
        <div>
          <dt className="text-neutral-600 text-xs uppercase mb-1">Category</dt>
          <dd>
            {site.category ? <CategoryChip category={site.category} /> : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-600 text-xs uppercase mb-1">Size</dt>
          <dd className="font-sans text-base">{formatAcres(site.acres)}</dd>
        </div>
      </dl>
      <SiteDescription
        site={site}
        onQuery={(q) => {
          setInput(q);
          ref.current?.focus();
          ref.current?.setSelectionRange(q.length, q.length);
        }}
      />
      {children}
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
