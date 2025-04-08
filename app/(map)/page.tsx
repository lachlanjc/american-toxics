import { Search } from "@/app/(map)/sites/search";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Link } from "next-view-transitions";

export default function Page() {
  return (
    <>
      <HeaderRoot showClose={false}>
        <HeaderTitle>Superfund Sites</HeaderTitle>
      </HeaderRoot>
      <Search>
        <Link href="/states">Explore by State</Link>
      </Search>
    </>
  );
}
