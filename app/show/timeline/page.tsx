import fs from "fs/promises";
import path from "path";
import ReactMarkdown from "react-markdown";

export const metadata = { title: "Timeline" };

const files = {
  "timeline-listed.md": "1981–1984",
  "timeline2.md": "1989–2024",
};

export default async function Page() {
  const file = 0;
  const filePath = path.join(
    process.cwd(),
    "lib",
    "data",
    Object.entries(files)[file][0]
  );
  const content = (await fs.readFile(filePath, "utf8")) || "";
  return (
    <div className="prose prose-sm max-w-none px-12 font-mono">
      <h1 className="mt-16 text-balance py-16 text-center font-sans text-6xl uppercase">
        All Superfund Sites in Chronological Order
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
