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
    Object.entries(files)[file][0],
  );
  const content = (await fs.readFile(filePath, "utf8")) || "";
  return (
    <div className="prose font-mono prose-sm max-w-none px-12">
      <h1 className="text-6xl font-sans text-balance uppercase text-center mt-16 py-16">
        Superfund Sites as&nbsp;Listed: {Object.entries(files)[file][1]}
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
