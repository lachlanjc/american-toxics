import fs from "fs/promises";
import path from "path";
import ReactMarkdown from "react-markdown";

export default async function Page() {
  const filePath = path.join(
    process.cwd(),
    "lib",
    "data",
    "timeline-listed.md",
  );
  const content = (await fs.readFile(filePath, "utf8")) || "";
  return (
    <div className="prose prose-neutral font-mono container">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
