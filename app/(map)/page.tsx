import { Search } from "@/app/(map)/sites/search";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Link } from "next-view-transitions";

export default function Page() {
  return (
    <>
      <HeaderRoot showClose={false}>
        <HeaderTitle>Superfund Sites</HeaderTitle>
      </HeaderRoot>
      <div className="grid grid-cols-3 gap-4 w-full font-sans font-medium text-neutral-800 leading-tight">
        <Link href="/states" className="action-button aspect-video p-4">
          Explore
          <br />
          by State
        </Link>
        <Link href="/npl" className="action-button aspect-video p-4">
          Explore
          <br />
          Cleanup Progress
        </Link>
        <Link href="/about" className="action-button aspect-video p-4">
          About
        </Link>
      </div>
      <hr className="border-black/20 -mx-6 my-6" />
      <Search>
        <p className="text-neutral-700 text-pretty">
          This is a map of places with dangerous amounts of toxic&nbsp;waste in
          the U.S., which the Environment Protection Agency (EPA) designates as
          Superfund sites.
        </p>
      </Search>
    </>
  );
}
