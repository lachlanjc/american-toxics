import fs from "fs/promises";
import path from "path";
import ReactMarkdown from "react-markdown";

export const metadata = { title: "Timeline" };

export default async function Page() {
  const filePath = path.join(
    process.cwd(),
    "lib",
    "data",
    "timeline-listed.md",
  );
  const content = (await fs.readFile(filePath, "utf8")) || "";
  return (
    <div className="prose font-mono prose-sm max-w-none">
      <h1 className="text-6xl font-sans text-balance uppercase text-center mt-12 py-16">
        Timeline of Superfund Sites by Listing Date
      </h1>
      <ReactMarkdown>{content}</ReactMarkdown>
      <style>{`
        .prose * {
          color: black !important;
        }
        em {
          font-style: normal;
          float: right;
        }
      `}</style>
    </div>
  );
}
