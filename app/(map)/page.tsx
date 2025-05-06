import { nplStatuses } from "@/lib/data/site";
import { categories } from "@/lib/data/site-categories";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { GitHubIcon } from "@/lib/ui/icons";
import { Link } from "next-view-transitions";
import SearchTabs from "./SearchTabs";
import NJ from "@/lib/icons/states/NJ";
import PA from "@/lib/icons/states/PA";
import NY from "@/lib/icons/states/NY";
import CA from "@/lib/icons/states/CA";
import SvgSludge from "@/lib/icons/Sludge";
import SvgInfo from "@/lib/icons/Info";
import SvgTarget from "@/lib/icons/Target";

export default function Page() {
  return (
    <>
      <HeaderRoot showClose={false}>
        <HeaderTitle>American Toxics</HeaderTitle>
        <a
          href="https://github.com/lachlanjc/superfund"
          className="opacity-40 transition-opacity hover:opacity-50 absolute top-0 right-0"
        >
          <GitHubIcon />
          <span className="sr-only">Open Source on GitHub</span>
        </a>
      </HeaderRoot>
      <SearchTabs />
      <hr className="border-black/20 -mx-6 my-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full font-sans text-lg font-medium tracking-tight text-neutral-800 leading-[1.125]">
        <Link
          href="/npl"
          className="action-button flex flex-col items-start gap-3 p-4 pb-3.5"
        >
          <div className="flex -gap-3 overflow-hidden max-w-full">
            {Object.values(nplStatuses).map(({ color }) => (
              <div
                key={color}
                className={`w-4 h-4 shrink-0 ${color} bg-current rounded-full outline-2 outline-[#efeef0]`}
              />
            ))}
          </div>
          Explore
          <br />
          Cleanup Progress
        </Link>
        <Link
          href="/categories"
          className="action-button flex flex-col items-start gap-2 p-4 py-3.5"
        >
          <div className="flex -gap-2 -ml-1 overflow-hidden max-w-full">
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
                <Icon key={color} className={`w-5 h-5 shrink-0 ${color}`} />
              ))}
          </div>
          Explore
          <br />
          by Category
        </Link>
        <Link
          href="/states"
          className="action-button flex flex-col items-start gap-3 p-4 pb-3.5"
        >
          <div
            className="flex -gap-3 h-4 fill-neutral-400"
            role="img"
            aria-label="State outlines of NJ, PA, NY, CA"
          >
            <NJ width="18" height="24" aria-hidden />
            <PA width="28" height="24" aria-hidden />
            <NY width="24" height="24" aria-hidden />
            <CA width="24" height="24" aria-hidden />
          </div>
          Explore
          <br />
          by State
        </Link>
        <Link
          href="/contaminants"
          className="action-button flex max-sm:flex-col sm:items-center gap-1.5 p-4"
        >
          <SvgSludge
            width={24}
            height={24}
            aria-label="Sludge icon"
            className="shrink-0 fill-neutral-400"
          />
          <span className="text-trim-both">Contaminants</span>
        </Link>
        <Link
          href="/scoreboard/results"
          className="action-button flex items-center gap-1.5 p-4"
        >
          <SvgTarget
            width={24}
            height={24}
            className="shrink-0 fill-neutral-400"
          />
          <span className="text-trim-both">Scoreboard</span>
        </Link>
        <Link
          href="/about"
          className="action-button flex items-center gap-1.5 p-4"
        >
          <SvgInfo
            width={24}
            height={24}
            className="shrink-0 fill-neutral-400"
          />
          <span className="text-trim-both">About</span>
        </Link>
      </div>
    </>
  );
}
