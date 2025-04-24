/**
 * Task to upload images from public/plainsite to Supabase images table.
 * Measures dimensions, stubs a URL, and inserts records with source="inplainsite".
 */
import fs from "fs";
import path from "path";
import { supabaseAdmin } from "@/lib/supabaseClient";
import sizeOf from "image-size";
import sharp from "sharp";
import { encode } from "blurhash";

// Ensure we have an admin client
if (!supabaseAdmin) {
  console.error(
    "Supabase admin client is not configured. Please set SUPABASE_SERVICE_ROLE_KEY.",
  );
  process.exit(1);
}

async function main() {
  const imagesDir = path.join(process.cwd(), "public", "plainsite");
  if (!fs.existsSync(imagesDir)) {
    console.error(`Directory ${imagesDir} does not exist`);
    process.exit(1);
  }
  const files = fs
    .readdirSync(imagesDir)
    .filter((f) => /\.(jpe?g|png|gif|webp|svg)$/i.test(f));
  console.log(`Found ${files.length} image(s) in ${imagesDir}`);

  // Build records with dimensions, blurhash, and site_id from filename
  const records: Array<{
    url: string;
    width: number | null;
    height: number | null;
    blurhash: string | null;
    source: string;
    siteId: string;
  }> = [];
  for (const filename of files) {
    const filepath = path.join(imagesDir, filename);
    // Get image dimensions
    let width: number | null = null;
    let height: number | null = null;
    try {
      const buffer = fs.readFileSync(filepath);
      const content = new Uint8Array(buffer);
      const dimensions = sizeOf(content);
      width = dimensions.width ?? null;
      height = dimensions.height ?? null;
    } catch (err: any) {
      console.warn(
        `Could not get dimensions for ${filename}:`,
        err.message || err,
      );
    }
    // Generate blurhash using sharp
    let blurhash: string | null = null;
    try {
      const { data, info } = await sharp(filepath)
        .ensureAlpha()
        .raw()
        .toBuffer({ resolveWithObject: true });
      const pixels = new Uint8ClampedArray(data as Uint8Array);
      // componentsX/Y control detail: 4x4 is a reasonable default
      blurhash = encode(pixels, info.width, info.height, 4, 4);
    } catch (err: any) {
      console.warn(
        `Could not generate blurhash for ${filename}:`,
        err.message || err,
      );
    }
    // Stub URL for app and extract site_id (filename without extension)
    const url = `/plainsite/${filename}`;
    const siteId = path.basename(filename, path.extname(filename));
    const record = {
      url,
      width,
      height,
      blurhash,
      source: "inplainsite",
      siteId,
    };
    records.push(record);
    await supabaseAdmin!.from("images").insert(record);
    console.log("Prepared image for site", siteId);
  }

  /*
  const chunkSize = 100;
  for (let i = 0; i < records.length; i += chunkSize) {
    const batch = records.slice(i, i + chunkSize);
    const { error } = await supabaseAdmin!.from("images").insert(batch);
    if (error) {
      console.error("Error inserting images batch:", error.message || error);
      process.exit(1);
    }
    console.log(
      `Inserted batch ${Math.floor(i / chunkSize) + 1}: ${batch.length} records`,
    );
  }
   */

  console.log(`Successfully inserted ${records.length} images.`);
}

main().catch((err: any) => {
  console.error("Unexpected error:", err.message || err);
  process.exit(1);
});
