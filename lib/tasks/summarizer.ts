import { zerox } from "zerox";
import { ModelOptions, ModelProvider } from "zerox/node-zerox/dist/types";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const pathname = "./data/0900956/88038192";

console.log("Scanning");
const scan = await zerox({
  filePath: `${pathname}.pdf`,
  modelProvider: ModelProvider.OPENAI,
  model: ModelOptions.OPENAI_GPT_4O,
  credentials: {
    apiKey: process.env.OPENAI_API_KEY ?? "",
  },
});
Bun.write(`${pathname}.json`, JSON.stringify(scan, null, 2));

const content = scan.pages.map((page) => page.content).join("\n\n");
Bun.write(`${pathname}.md`, content);

console.log("Wrote plain Markdown version");

function countLines(text: string): number {
  return text.split("\n").filter((line) => line.trim().length > 0).length;
}

const initialLines = countLines(content);
const result = await generateText({
  model: openai("gpt-4o"),
  system: `Clean up this Markdown document.

- Remove images, and tables that are predominantly images
- Remove syntax for <page_number> and <logo> and the document title being repeated
- Remove the table of contents
- Ensure the document uses clean Markdown formatting
`,
  prompt: content,
});
const cleanedText = result.text;
const cleanedLines = countLines(cleanedText);

console.log("Finished LLM cleanup");
console.log(`Lines removed: ${initialLines - cleanedLines} of ${initialLines}`);
Bun.write(`${pathname}-clean.md`, cleanedText);
