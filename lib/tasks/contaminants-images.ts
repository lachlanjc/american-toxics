import { supabase } from "../supabaseClient";
import PQueue from "p-queue";

// Limit concurrency to avoid rate limits
const queue = new PQueue({ concurrency: 2 });

/**
 * Fetch Wikipedia image info (REST summary API) for a given page title
 */
async function fetchWikiImageInfo(url: string): Promise<{
  url: string | null;
  width: number | null;
  height: number | null;
  caption: string | null;
  alt: string | null;
} | null> {
  const slug = url.split("/").pop() || "";
  if (!slug) return null;
  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${slug}`;
  try {
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json: any = await res.json();
    const img = json.originalimage;
    return {
      url: img?.source ?? null,
      width: img?.width ?? null,
      height: img?.height ?? null,
      caption: json.description ?? null,
      alt: json.description ?? null,
    };
  } catch (err: any) {
    console.error(
      `Error fetching Wikipedia image for ${title}:`,
      err.message || err,
    );
    return { url: null, width: null, height: null, caption: null, alt: null };
  }
}

// Define contaminant row type for image processing
type ContaminantImageRow = {
  id: string;
  name: string;
  images: string[] | null;
};

/**
 * Process images for a single contaminant: fetch image info, insert into images table,
 * and update the contaminant record to include the new image UUID
 */
async function processContaminantImages(
  row: ContaminantImageRow,
): Promise<void> {
  console.log(`Processing images for ${row.id} (${row.name})`);
  try {
    // Fetch image metadata from Wikipedia
    const info = await fetchWikiImageInfo(row.wikipediaUrl);
    if (!info.url) {
      console.log(`No Wikipedia image found for ${row.name}`);
      return;
    }
    // Insert into images table
    const { data: imgRec, error: imgErr } = await supabase
      .from("images")
      .insert({
        url: info.url,
        alt: info.alt,
        width: info.width,
        height: info.height,
        caption: info.caption,
        source: "wikipedia",
      })
      .select("id")
      .single();
    if (imgErr) {
      console.error(
        `Error inserting image for ${row.id}:`,
        imgErr.message || imgErr,
      );
      return;
    }
    const imgId = imgRec?.id;
    if (!imgId) {
      console.error(`No image ID returned for ${row.id}`);
      return;
    }
    // Append to existing images array
    const existing = Array.isArray(row.images) ? row.images : [];
    const newImages = [...existing, imgId];
    // Update contaminant record
    const { error: updErr } = await supabase
      .from("contaminants")
      .update({ images: newImages })
      .eq("id", row.id);
    if (updErr) {
      console.error(
        `Error updating contaminant images for ${row.id}:`,
        updErr.message || updErr,
      );
    } else {
      console.log(`Updated contaminant images for ${row.id}`);
    }
    // Throttle requests
    await new Promise((r) => setTimeout(r, 500));
  } catch (err: any) {
    console.error(
      `Failed processing images for ${row.id}:`,
      err.message || err,
    );
  }
}

// Main: fetch contaminants with no images and enqueue processing
async function main() {
  const { data, error } = await supabase
    .from("contaminants")
    .select("id,name,images,wikipediaUrl")
    .eq("images", [])
    .not("wikipediaUrl", "is", null);
  if (error) {
    console.error("Error fetching contaminants:", error.message || error);
    process.exit(1);
  }
  const rows: ContaminantImageRow[] = data || [];
  const toProcess = rows.filter(
    (r) => !(Array.isArray(r.images) && r.images.length > 0),
  );
  console.log(`Found ${toProcess.length} contaminants needing images.`);
  for (const row of toProcess) {
    queue.add(() => processContaminantImages(row));
  }
  await queue.onIdle();
  console.log("All image tasks complete.");
}

// Execute
main();
