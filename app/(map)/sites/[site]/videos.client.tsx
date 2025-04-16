"use client";
import {
  TikTokEmbed,
  InstagramEmbed,
  FacebookEmbed,
} from "react-social-media-embed";

import { WellRoot, WellTitle } from "@/lib/ui/well";
import * as Collapsible from "@radix-ui/react-collapsible";
import React from "react";
import clsx from "clsx";

export interface Video {
  title: string;
  link: string;
  publisher?: string;
  thumbnail?: string;
  duration?: { text: string; iso: string };
}

interface VideosClientProps {
  videos: Video[];
}

export function VideosClient({ videos }: VideosClientProps) {
  return (
    <Collapsible.Root asChild>
      <WellRoot className="pb-0">
        <Collapsible.Trigger className="flex items-center gap-2 justify-between group w-[calc(100%_+_2rem)] px-4 -mx-4 py-3 -mt-3">
          <WellTitle>Videos around the web</WellTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-180 stroke-neutral-600"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Collapsible.Trigger>
        <Collapsible.Content className="overflow-x-auto snap-x snap-mandatory data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp -mr-4 pr-4 pb-4">
          <div
            className={clsx(
              "w-fit grid grid-flow-col items-center gap-4",
              videos.length > 2 && "grid-rows-2",
            )}
          >
            {videos.map((video) => {
              const { link, title } = video;
              if (link.includes("facebook.com")) {
                return (
                  <div
                    key={link}
                    className="snap-start row-start-1 row-span-2 rounded-xl relative"
                  >
                    <FacebookEmbed url={link} width={320} />
                  </div>
                );
              }
              if (link.includes("tiktok.com")) {
                return (
                  <div
                    key={link}
                    className="snap-start row-start-1 row-span-2 relative"
                  >
                    <TikTokEmbed url={link} width={320} />
                  </div>
                );
              }
              if (link.includes("instagram.com")) {
                return (
                  <div
                    key={link}
                    className="snap-start row-start-1 row-span-2 relative"
                  >
                    <InstagramEmbed url={link} width={320} />
                  </div>
                );
              }
              // Fallback to YouTube or generic iframe
              const videoId = extractYouTubeID(link);
              const embedUrl = videoId
                ? `https://www.youtube.com/embed/${videoId}`
                : link;
              return (
                <div
                  key={link}
                  className="relative aspect-video rounded-lg snap-start w-xs overflow-hidden"
                >
                  <iframe
                    src={embedUrl}
                    title={title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
              );
            })}
          </div>
        </Collapsible.Content>
      </WellRoot>
    </Collapsible.Root>
  );
}

function extractYouTubeID(url: string): string | null {
  const match = url.match(
    /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}
