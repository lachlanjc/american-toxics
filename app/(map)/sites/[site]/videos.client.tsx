"use client";

import { WellRoot, WellTitle } from "@/lib/ui/well";
import * as Collapsible from "@radix-ui/react-collapsible";
import React from "react";

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
      <WellRoot className="mt-4 pb-4">
        <Collapsible.Trigger className="flex items-center gap-2 justify-between group w-full">
          <WellTitle>Videos</WellTitle>
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
        <Collapsible.Content className="overflow-x-auto snap-x snap-mandatory data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp pt-2 -mr-4 pr-4">
          <div className="w-fit flex gap-4">
            {videos.map((video) => {
              const videoId = extractYouTubeID(video.link);
              const embedUrl = videoId
                ? `https://www.youtube.com/embed/${videoId}`
                : video.link;
              return (
                <div
                  key={video.link}
                  className="relative aspect-video rounded-lg snap-start h-40 overflow-hidden"
                >
                  <iframe
                    src={embedUrl}
                    title={video.title}
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
