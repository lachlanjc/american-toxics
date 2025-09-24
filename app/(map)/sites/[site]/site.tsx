"use client";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/ui-utils";
import { Root as Portal } from "@radix-ui/react-portal";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { useEffect, useRef } from "react";
import reactStringReplace from "react-string-replace";
import type { SupabaseSite } from "@/lib/data/site";
import { HeaderRoot, HeaderSubtitle, HeaderTitle } from "@/lib/ui/header";
import { OpenAIIcon } from "@/lib/ui/icons";
import { Heading } from "@/lib/ui/typography";
import { formatAcres } from "@/lib/util/distance";
import { useFocusable } from "@/lib/util/use-focusable";
import type { Database } from "@/supabase/types";
import { CategoryChip } from "./category";

const questions = [
  "How is cleanup progressing? Is it safe to be here?",
  "What parties are responsible?",
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
      className={"decoration-double underline-offset-4 cursor-zoom-in"}
      data-text={text}
      onClick={() => {
        const is =
          text.includes("and") ||
          text.includes("&") ||
          text.endsWith("s") ||
          text.endsWith("s)")
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

// 1 × * but NOT **   ───────────────────────────────────────────────┐
export const markRegex = /(?<!\*)\*([^*]+?)\*(?!\*)/g;
// 2 × * but NOT ***  ───────────────────────────────────────────────┘
export const boldRegex = /(?<!\*)\*\*([\s\S]+?)\*\*(?!\*)/g;

const deasterisk = (txt: string) => txt.replaceAll("*", "").trim();
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
          return (
            <strong data-text={match} key={match}>
              {markText(match)}
            </strong>
          );
        },
      );
      const marked = markText(bolded);
      return (
        <div data-text={part.text} key={`part-${i}-${part.text}`}>
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
  const text = site.summary ?? "";
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
  const bolded = reactStringReplace(text, boldRegex, (match: string) => {
    return <strong key={match}>{markText(match)}</strong>;
  });
  const marked = markText(bolded);
  const epa = (
    <abbr title="Environmental Protection Agency" className="no-underline">
      EPA
    </abbr>
  );
  return (
    <section className="pb-1">
      <p className={`whitespace-pre-wrap text-neutral-600 text-pretty`}>
        {marked}
      </p>
      <div className="flex items-center gap-2.5 mt-2 text-neutral-500 text-xs">
        <OpenAIIcon className="w-5 h-5" />
        {site.epaUrl ? (
          <a
            href={site.epaUrl}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-3 hover:text-primary transition-colors"
          >
            {epa} information
          </a>
        ) : (
          <>{epa} information</>
        )}{" "}
        summarized by GPT-5
      </div>
    </section>
  );
}

const credits: Record<string, string> = {
  inplainsite: "Federica Armstrong, In Plain Site",
  alexisoltmer: "Alexis Oltmer",
};

function FloatingImage({
  id,
  width,
  height,
  url,
  blurhash,
  alt,
  source = "",
}: Database["public"]["Tables"]["images"]["Row"]) {
  return (
    <figure key={id} className="floating-image overflow-hidden">
      <Image
        src={url}
        width={width || 512}
        height={height || 512}
        blurDataURL={blurhash || undefined}
        placeholder="blur"
        alt={alt || ""}
      />
      <figcaption className="absolute bottom-0 left-0 right-0 p-3 bg-white/80 backdrop-blur-md backdrop-saturate-150 rounded-b-lg leading-snug font-sans text-balance text-trim-both">
        Photo by {credits[source || ""] ?? source}
      </figcaption>
    </figure>
  );
}

export function SiteCard({
  site,
  images = [],
  children,
}: React.PropsWithChildren<{
  site: SupabaseSite;
  images?: Array<Database["public"]["Tables"]["images"]["Row"]>;
}>) {
  const ref = useFocusable();
  const scrollRef = useRef<HTMLDivElement>(null);
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
    <div className="flex flex-col gap-4">
      {Array.isArray(images) && images.length > 0 && (
        <Portal>
          {images.map((img) => (
            <FloatingImage key={img.id} {...img} />
          ))}
        </Portal>
      )}
      <HeaderRoot>
        <HeaderTitle style={{ viewTransitionName: site.id }}>
          {site.name} Superfund Site
        </HeaderTitle>
        <HeaderSubtitle>
          {site.city}
          {!site.stateCode || site.stateCode === "undefined" ? null : (
            <>
              {", "}
              <Link
                href={`/states/${site.stateCode}`}
                className="underline underline-offset-3 hover:text-primary transition-colors"
              >
                <abbr title={site.stateName ?? ""} className="no-underline">
                  {site.stateCode}
                </abbr>
              </Link>
            </>
          )}{" "}
          ({site.county} County)
        </HeaderSubtitle>
      </HeaderRoot>

      <dl className="grid grid-cols-2 -mt-4">
        <div>
          <dt className="text-neutral-600 text-xs uppercase mb-1">Category</dt>
          <dd>
            {site.category ? <CategoryChip category={site.category} /> : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-600 text-xs uppercase mb-1">Size</dt>
          <dd className="font-sans text-lg">{formatAcres(site.acres)}</dd>
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
            className={`whitespace-pre-wrap even:mb-4 ${message.role === "user" ? "font-bold font-sans text-lg mb-1" : "text-neutral-600"} md:pr-6`}
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
        <div className="flex flex-col w-full">
          <Heading className="mb-1">Suggested questions</Heading>
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

      <div ref={scrollRef} />
      <form
        onSubmit={(e) => {
          handleSubmit(e);
          scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
        }}
        className="mt-auto w-full pt-2 sticky bottom-0"
      >
        <input
          className="w-full action-button p-2 !bg-white"
          value={input}
          placeholder="Ask something..."
          onChange={handleInputChange}
          ref={ref}
        />
      </form>
    </div>
  );
}
