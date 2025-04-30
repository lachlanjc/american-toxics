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
    <div className="prose prose-neutral font-mono prose-sm max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
      <style>{`
        em {
          font-style: normal;
          float: right;
        }
      `}</style>
    </div>
  );
}
