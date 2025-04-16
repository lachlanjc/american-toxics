import { zerox } from "zerox";
import { ModelOptions, ModelProvider } from "zerox/node-zerox/dist/types";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const id = "NYN000203407";
const pathname = `./lib/data/zerox/${id}`;

console.log("Scanning");
const scan = await zerox({
  filePath: "./data/NYN000206282.pdf",
  modelProvider: ModelProvider.OPENAI,
  model: ModelOptions.OPENAI_GPT_4_1_MINI,
  credentials: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
  },
});
Bun.write(`${pathname}.json`, JSON.stringify(scan, null, 2));

const content = scan.pages.map((page) => page.content).join("\n\n");
Bun.write(`${pathname}-raw.md`, content);
console.log("Wrote plain Markdown version");

// const file = Bun.file(`${pathname}-raw.md`);
// const content = await file.text();

function countLines(text: string): number {
  return text.split("\n").filter((line) => line.trim().length > 0).length;
}

const initialLines = countLines(content);
const result = await generateText({
  model: openai("gpt-4.1-mini"),
  system: `Clean up this Markdown document.

- Remove images, and tables that are predominantly images
- Remove syntax for <page_number> and <logo> and the document title being repeated
- Remove the table of contents
- Remove "page intentionally left blank" lines
- Ensure the document uses clean Markdown formatting
`,
  prompt: content,
});
const cleanedText = result.text;
const cleanedLines = countLines(cleanedText);

console.log("Finished LLM cleanup");
console.log(`Lines removed: ${initialLines - cleanedLines} of ${initialLines}`);
Bun.write(`${pathname}.md`, cleanedText);
