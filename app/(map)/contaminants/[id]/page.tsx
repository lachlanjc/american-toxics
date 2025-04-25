import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { HeaderRoot, HeaderTitle, HeaderBreadcrumb } from "@/lib/ui/header";
import clsx from "clsx";
import { groupings } from "../../sites/[site]/contaminants";
import { OpenAIIcon } from "@/lib/ui/icons";
import { WellRoot, WellTitle } from "@/lib/ui/well";
import { Database } from "@/supabase/types";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = params;
  const { data, error } = await supabase
    .from("contaminants")
    .select("name, summary")
    .eq("id", id)
    .single();
  if (error || !data) {
    return { title: "Contaminant not found" };
  }
  return {
    title: data.name,
    description: data.summary ?? undefined,
  };
}

export default async function ContaminantPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const { data: contaminant, error } = await supabase
    .from("contaminants")
    .select("id, name, summary, contexts, siteCount, epaPdfUrl, wikipediaUrl")
    .eq("id", id)
    .single();
  if (error || !contaminant) {
    console.error("Error fetching contaminant", error);
    return notFound();
  }

  const {
    name,
    summary,
    contexts = [],
    siteCount,
    epaPdfUrl,
    wikipediaUrl,
  } = contaminant;
  const images: Array<Database["public"]["Tables"]["images"]["Row"]> = [];
  /*
  // fetch related images
  const { data: images, error: imagesError } = await supabase
    .from("images")
    .select("url, width, height, alt, caption, source, blurhash")
    .eq("contaminant_id", id);
  if (imagesError) console.error("Error fetching contaminant images", imagesError);
  */

  return (
    <>
      <HeaderRoot showClose>
        <HeaderBreadcrumb href="/contaminants">
          All Contaminants
        </HeaderBreadcrumb>
        <HeaderTitle>{name}</HeaderTitle>
        {/* <HeaderSubtitle>Contaminant details</HeaderSubtitle> */}
      </HeaderRoot>

      {summary && (
        <p className="whitespace-pre-wrap text-neutral-600 text-pretty">
          {summary}
        </p>
      )}
      <div className="flex items-center mt-4 text-neutral-600 text-xs">
        <OpenAIIcon className="w-5 h-5 fill-neutral-500 mr-3" />
        <span>
          {epaPdfUrl ? (
            <>
              <a
                href={epaPdfUrl}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-3 hover:text-primary transition-colors"
              >
                EPA document
              </a>
              {" & "}
            </>
          ) : null}
          {wikipediaUrl ? (
            <a
              href={wikipediaUrl}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-3 hover:text-primary transition-colors"
            >
              Wikipedia
            </a>
          ) : (
            <span>Wikipedia</span>
          )}{" "}
          summarized by GPT-4.1
        </span>
      </div>

      {contexts.length > 0 && (
        <WellRoot className="mt-6">
          <WellTitle>
            Contaminating {siteCount} site{siteCount === 1 ? "" : "s"} across:
          </WellTitle>
          <ul
            role="list"
            className="flex flex-wrap justify-start gap-4 mt-2 font-sans text-lg font-medium -ml-1"
          >
            {contexts.map((ctx: keyof typeof groupings) => {
              const grouping = groupings[ctx];
              const Icon = grouping?.icon;
              return (
                <li key={ctx} className="flex items-center gap-1">
                  {Icon && (
                    <Icon
                      width={48}
                      height={48}
                      className={clsx(grouping.color)}
                      aria-hidden
                    />
                  )}
                  <span>{grouping?.label || ctx}</span>
                </li>
              );
            })}
          </ul>
        </WellRoot>
      )}
      {images && images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          {images.map((img) => (
            <figure key={img.url} className="flex flex-col">
              <Image
                src={img.url}
                width={img.width || undefined}
                height={img.height || undefined}
                alt={img.alt ?? ""}
                {...(img.blurhash
                  ? { placeholder: "blur", blurDataURL: img.blurhash }
                  : {})}
                className="object-cover w-full h-auto rounded"
              />
              {img.caption && (
                <figcaption className="mt-2 text-sm text-neutral-600">
                  {img.caption}
                </figcaption>
              )}
              {img.source && (
                <figcaption className="mt-1 text-xs text-neutral-500">
                  Source:{" "}
                  <a
                    href={img.source}
                    target="_blank"
                    rel="noreferrer"
                    className="underline underline-offset-2 hover:text-primary transition-colors"
                  >
                    {img.source}
                  </a>
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
