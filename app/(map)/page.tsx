import { Link } from "next-view-transitions";
import { nplStatuses } from "@/lib/data/site";
import { categories } from "@/lib/data/site-categories";
import SvgInfo from "@/lib/icons/Info";
import SvgSludge from "@/lib/icons/Sludge";
import CA from "@/lib/icons/states/CA";
import NJ from "@/lib/icons/states/NJ";
import NY from "@/lib/icons/states/NY";
import PA from "@/lib/icons/states/PA";
import SvgTarget from "@/lib/icons/Target";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { GitHubIcon } from "@/lib/ui/icons";
import SearchTabs from "./SearchTabs";

export default function Page() {
  return (
    <>
      <HeaderRoot showClose={false}>
        <HeaderTitle>American Toxics</HeaderTitle>
        <a
          className="absolute top-0 right-0 opacity-40 transition-opacity hover:opacity-50"
          href="https://github.com/lachlanjc/superfund"
        >
          <GitHubIcon />
          <span className="sr-only">Open Source on GitHub</span>
        </a>
      </HeaderRoot>
      <SearchTabs />
      <hr className="-mx-6 my-6 border-black/20" />
      <div className="grid w-full grid-cols-2 gap-4 font-medium font-sans text-lg text-neutral-800 leading-[1.125] tracking-tight sm:grid-cols-3">
        <Link
          className="action-button flex flex-col items-start gap-3 p-4 pb-3.5"
          href="/npl"
        >
          <div className="-gap-3 flex max-w-full overflow-hidden">
            {Object.values(nplStatuses).map(({ color }) => (
              <div
                className={`h-4 w-4 shrink-0 ${color} rounded-full bg-current outline-2 outline-[#efeef0]`}
                key={color}
              />
            ))}
          </div>
          Explore
          <br />
          Cleanup Progress
        </Link>
        <Link
          className="action-button flex flex-col items-start gap-2 p-4 py-3.5"
          href="/categories"
        >
          <div className="-gap-2 -ml-1 flex max-w-full overflow-hidden">
            {[
              "chemical",
              "military",
              "manufacturing",
              "water",
              "mining",
              "fuel",
            ]
              .map((cat) => categories[cat as keyof typeof categories])
              .map(({ color, icon: Icon }) => (
                <Icon className={`h-5 w-5 shrink-0 ${color}`} key={color} />
              ))}
          </div>
          Explore
          <br />
          by Category
        </Link>
        <Link
          className="action-button flex flex-col items-start gap-3 p-4 pb-3.5"
          href="/states"
        >
          <div
            aria-label="State outlines of NJ, PA, NY, CA"
            className="-gap-3 flex h-4 fill-neutral-400"
            role="img"
          >
            <NJ aria-hidden height="24" width="18" />
            <PA aria-hidden height="24" width="28" />
            <NY aria-hidden height="24" width="24" />
            <CA aria-hidden height="24" width="24" />
          </div>
          Explore
          <br />
          by State
        </Link>
        <Link
          className="action-button flex gap-1.5 p-4 max-sm:flex-col sm:items-center"
          href="/contaminants"
        >
          <SvgSludge
            aria-label="Sludge icon"
            className="shrink-0 fill-neutral-400"
            height={24}
            width={24}
          />
          <span className="text-trim-both">Contaminants</span>
        </Link>
        <Link
          className="action-button flex items-center gap-1.5 p-4"
          href="/scoreboard/results"
        >
          <SvgTarget
            className="shrink-0 fill-neutral-400"
            height={24}
            width={24}
          />
          <span className="text-trim-both">Scoreboard</span>
        </Link>
        <Link
          className="action-button flex items-center gap-1.5 p-4"
          href="/about"
        >
          <SvgInfo
            className="shrink-0 fill-neutral-400"
            height={24}
            width={24}
          />
          <span className="text-trim-both">About</span>
        </Link>
      </div>
    </>
  );
}
