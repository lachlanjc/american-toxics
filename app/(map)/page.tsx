import { Search } from "@/app/(map)/sites/search";
import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <HeaderRoot showClose={false}>
        <HeaderTitle>Explore Superfund Sites</HeaderTitle>
      </HeaderRoot>
      <Search>
        <Link href="/states">Explore by State</Link>
      </Search>
    </>
  );
}
