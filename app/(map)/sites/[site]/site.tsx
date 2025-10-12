"use client";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/ui-utils";
import { Root as Portal } from "@radix-ui/react-portal";
import Image from "next/image";
import Link from "next/link";
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
      className={"cursor-zoom-in decoration-double underline-offset-4"}
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
        reactStringReplace(text, markRegex, (match: string, i: number) => (
          <AITextHighlight
            key={[match, i].join("")}
            onQuery={onQuery}
            text={match}
          />
        ));
      const bolded = reactStringReplace(
        part.text,
        boldRegex,
        (match: string) => (
          <strong data-text={match} key={match}>
            {markText(match)}
          </strong>
        )
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
    reactStringReplace(text, markRegex, (match: string, i: number) => (
      <AITextHighlight
        key={[match, i].join("")}
        onQuery={onQuery}
        text={match}
      />
    ));
  const bolded = reactStringReplace(text, boldRegex, (match: string) => (
    <strong key={match}>{markText(match)}</strong>
  ));
  const marked = markText(bolded);
  const epa = (
    <abbr className="no-underline" title="Environmental Protection Agency">
      EPA
    </abbr>
  );
  return (
    <section className="pb-1">
      <p className={"whitespace-pre-wrap text-pretty text-neutral-600"}>
        {marked}
      </p>
      <div className="mt-2 flex items-center gap-2.5 text-neutral-500 text-xs">
        <OpenAIIcon className="h-5 w-5" />
        {site.epaUrl ? (
          <a
            className="underline underline-offset-3 transition-colors hover:text-primary"
            href={site.epaUrl}
            rel="noreferrer"
            target="_blank"
          >
            {epa} information
          </a>
        ) : (
          <>{epa} information</>
        )}{" "}
        summarized by GPT-4.1
      </div>
    </section>
  );
}

const credits: Record<string, string> = {
  inplainsite: "Federica Armstrong, In Plain Site",
  alexisoltmer: "Alexis Oltmer",
  lachlanjc: "Lachlan Campbell",
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
    <figure className="floating-image overflow-hidden" key={id}>
      <Image
        alt={alt || ""}
        blurDataURL={blurhash || undefined}
        height={height || 512}
        placeholder="blur"
        src={url}
        width={width || 512}
      />
      <figcaption className="absolute right-0 bottom-0 left-0 text-balance rounded-b-lg bg-white/80 p-3 font-sans text-trim-both leading-snug backdrop-blur-md backdrop-saturate-150">
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
          m.parts.some((p) => p.type === "text" && p.text === q)
      )
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
                className="underline underline-offset-3 transition-colors hover:text-primary"
                href={`/states/${site.stateCode}`}
              >
                <abbr className="no-underline" title={site.stateName ?? ""}>
                  {site.stateCode}
                </abbr>
              </Link>
            </>
          )}{" "}
          ({site.county} County)
        </HeaderSubtitle>
      </HeaderRoot>

      <dl className="-mt-4 grid grid-cols-2">
        <div>
          <dt className="mb-1 text-neutral-600 text-xs uppercase">Category</dt>
          <dd>
            {site.category ? <CategoryChip category={site.category} /> : "—"}
          </dd>
        </div>
        <div>
          <dt className="mb-1 text-neutral-600 text-xs uppercase">Size</dt>
          <dd className="font-sans text-lg">{formatAcres(site.acres)}</dd>
        </div>
      </dl>

      <SiteDescription
        onQuery={(q) => {
          setInput(q);
          ref.current?.focus();
          ref.current?.setSelectionRange(q.length, q.length);
        }}
        site={site}
      />
      {children}

      <section>
        {messages.map((message) => (
          <div
            className={`whitespace-pre-wrap even:mb-4 ${message.role === "user" ? "mb-1 font-bold font-sans text-lg" : "text-neutral-600"} md:pr-6`}
            key={message.id}
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
        <div className="flex w-full flex-col">
          <Heading className="mb-1">Suggested questions</Heading>
          {suggestions.map((q) => (
            <button
              className="cursor-pointer text-balance border-zinc-300 border-b py-2 text-left text-xs text-zinc-600 transition-opacity last:border-b-0 hover:opacity-80"
              key={q}
              onClick={() => {
                append({ role: "user", content: q });
              }}
              type="button"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div ref={scrollRef} />
      <form
        className="sticky bottom-0 mt-auto w-full pt-2"
        onSubmit={(e) => {
          handleSubmit(e);
          scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <input
          className="action-button !bg-white w-full p-2"
          onChange={handleInputChange}
          placeholder="Ask something…"
          ref={ref}
          value={input}
        />
      </form>
    </div>
  );
}
