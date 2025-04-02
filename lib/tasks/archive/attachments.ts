import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import fs from "fs";
import path from "path";

const files = [];

function getPDFs(dirPath: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      if (err) {
        return reject(err);
      }
      // Filter for PDF files and map to their filenames
      const pdfFiles = files.filter(
        (file) =>
          path.extname(file).toLowerCase() === ".pdf" &&
          path.basename(file).startsWith("1"),
      );
      resolve(pdfFiles);
    });
  });
}

const pdfUrls = [
  "https://semspub.epa.gov/work/09/100002407.pdf",
  "https://semspub.epa.gov/work/09/100002408.pdf",
  "https://semspub.epa.gov/work/09/100002409.pdf",
  "https://semspub.epa.gov/work/09/100002412.pdf",
  "https://semspub.epa.gov/work/09/100002427.pdf",
];

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages = [] } = await req.json();
  console.log(messages);
  if (messages[0].role !== "system") {
    messages.unshift({
      role: "system",
      content:
        "You are a helpful assistant who is knowledgeable about contaminated waste Superfund sites in the US. You will be provided with PDF reports written by scientists, and your job is to summarize the key findings in a concise manner readable to regular educated people. You should only pull information from the PDF files.",
      // experimental_attachments: pdfUrls.map((url) => ({
      //   type: "file",
      //   mimeType: "application/pdf",
      //   url,
      // })),
    });
    // }
    // if (typeof messages[1].content === "string") {
    const pdfFiles = await getPDFs("./data/43360032");
    // messages[1].content = [
    //   {
    //     type: "text",
    //     data: messages[1].content,
    //   },
    // ];
    // pdfFiles.forEach((file) => {
    //   const filePath = path.join("./data/43360032", file);
    //   const fileContent = fs.readFileSync(filePath);
    //   const base64Content = Buffer.from(fileContent).toString("base64");
    //   const dataUrl = `data:application/pdf;base64,${base64Content}`;
    //   messages[0].content.push({
    //     type: "file",
    //     data: dataUrl,
    //     mimeType: "application/pdf",
    //     filename: file, // optional
    //   });
    // });

    messages.unshift({
      role: "user",
      content: pdfUrls.forEach((url) => ({
        type: "file",
        mimeType: "application/pdf",
        data: new URL(url),
      })),
    });
  }
  console.log(messages);

  const result = streamText({
    model: openai("gpt-4o"),
    messages,
  });

  return result.toDataStreamResponse();
}
