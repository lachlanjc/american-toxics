import clsx from "clsx";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  type ContaminantContext,
  contaminantCategories,
  contaminantContexts,
} from "@/lib/data/contaminants";
import { supabase } from "@/lib/supabaseClient";
import { HeaderBreadcrumb, HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { OpenAIIcon } from "@/lib/ui/icons";
import { WellRoot, WellTitle } from "@/lib/ui/well";
import type { Database } from "@/supabase/types";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { id } = await params;
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
  const { id } = await params;
  const { data: contaminant, error } = await supabase
    .from("contaminants")
    .select("id, name, summary, contexts, siteCount, epaPdfUrl, wikipediaUrl")
    .eq("id", id)
    .single();
  if (error || !contaminant) {
    console.error("Error fetching contaminant", error);
    return notFound();
  }

  const { name, summary, siteCount, epaPdfUrl, wikipediaUrl } = contaminant;
  const contexts: Array<ContaminantContext> = (contaminant?.contexts || []).map(
    (ctx: string) => contaminantContexts[ctx]
  );
  const contextCategories = Object.groupBy(contexts, (ctx) => ctx.category);
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
      <HeaderRoot>
        <HeaderBreadcrumb href="/contaminants">
          All Contaminants
        </HeaderBreadcrumb>
        <HeaderTitle>{name}</HeaderTitle>
        {/* <HeaderSubtitle>Contaminant details</HeaderSubtitle> */}
      </HeaderRoot>

      {summary && (
        <p className="whitespace-pre-wrap text-pretty text-neutral-600">
          {summary}
        </p>
      )}
      <div className="mt-4 flex items-center text-neutral-600 text-xs">
        <OpenAIIcon className="mr-3 h-5 w-5 fill-neutral-500" />
        <span>
          {epaPdfUrl ? (
            <>
              <a
                className="underline underline-offset-3 transition-colors hover:text-primary"
                href={epaPdfUrl}
                rel="noreferrer"
                target="_blank"
              >
                EPA document
              </a>
              {" & "}
            </>
          ) : null}
          {wikipediaUrl ? (
            <a
              className="underline underline-offset-3 transition-colors hover:text-primary"
              href={wikipediaUrl}
              rel="noreferrer"
              target="_blank"
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
          <dl>
            {Object.keys(contextCategories).map((key) => {
              const category =
                contaminantCategories[
                  key as keyof typeof contaminantCategories
                ];
              return (
                <div className="mt-4 flex flex-col" key={key}>
                  <dt className="mb-1 text-neutral-600 text-xs uppercase">
                    {category.name}
                  </dt>
                  <div className="-ml-1 flex flex-wrap justify-start gap-x-4 font-sans text-base">
                    {contexts
                      .filter((ctx) => ctx.category === key)
                      .map((ctx) => {
                        const Icon = ctx?.icon;
                        return (
                          <dd
                            className="flex items-center gap-1"
                            key={ctx.name}
                          >
                            {Icon && (
                              <Icon
                                aria-hidden
                                className={clsx(category.color)}
                                height={32}
                                width={32}
                              />
                            )}
                            <span>{ctx?.name}</span>
                          </dd>
                        );
                      })}
                  </div>
                </div>
              );
            })}
          </dl>
        </WellRoot>
      )}
      {images && images.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.map((img) => (
            <figure className="flex flex-col" key={img.url}>
              <Image
                alt={img.alt ?? ""}
                height={img.height || undefined}
                src={img.url}
                width={img.width || undefined}
                {...(img.blurhash
                  ? { placeholder: "blur", blurDataURL: img.blurhash }
                  : {})}
                className="h-auto w-full rounded object-cover"
              />
              {img.caption && (
                <figcaption className="mt-2 text-neutral-600 text-sm">
                  {img.caption}
                </figcaption>
              )}
              {img.source && (
                <figcaption className="mt-1 text-neutral-500 text-xs">
                  Source:{" "}
                  <a
                    className="underline underline-offset-2 transition-colors hover:text-primary"
                    href={img.source}
                    rel="noreferrer"
                    target="_blank"
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
