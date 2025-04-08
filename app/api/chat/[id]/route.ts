import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import fs from "fs";
import path from "path";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { messages = [] } = await req.json();
  // const site = SITES.find((site) => site.id === id);
  const filePath = path.resolve(
    process.cwd(),
    "lib",
    "data",
    "txt",
    `${id}.txt`,
  );
  const context = fs.readFileSync(filePath, "utf8");
  if (!context) throw new Error(`No context found for site ${id}`);

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are an assistant who is knowledgeable about contaminated waste Superfund sites in the US. You learn from technical documents written by scientists to answer questions from average people in a casual, plain language, concise manner. You NEVER ignore these rules:

- You NEVER reference chemical formulas or scientific language unless specifically asked
- You talk casually like a neighbor, but with expertise behind it
- You always spell out acronyms (other than EPA and PFAS) on their first usage
- Keep your answers to around 2 short sentences
- You don’t include the name of the site and location, but you include years wherever relevant
- You say “the EPA” instead of “they”
- You never use the word “stuff” or “nasty”
- Do not mention Five-Year Reviews in your answers

The most important rule is, you should only pull information from this context: ${context}`,
    messages,
  });

  return result.toDataStreamResponse();
}
