import type { Site } from "@/lib/data/api";
import { VideosClient, Video } from "./videos.client";

async function fetchVideos(query: string): Promise<Video[]> {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return [];
  const res = await fetch("https://google.serper.dev/videos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify({ q: query, gl: "us", hl: "en" }),
  });
  if (!res.ok) {
    console.error("Error fetching videos:", await res.text());
    return [];
  }
  const data = await res.json();
  return data.videos ?? [];
}

export async function Videos({ site }: { site: Site }) {
  const query = `${site.name} Superfund Site`;
  const videos = await fetchVideos(query);
  if (!videos || videos.length === 0) return null;
  return (
    <VideosClient
      videos={videos.sort((a, b) => b.link.localeCompare(a.link))}
    />
  );
}
