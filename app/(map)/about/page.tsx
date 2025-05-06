import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Heading } from "@/lib/ui/typography";
import { supabase } from "@/lib/supabaseClient";
import { Link } from "next-view-transitions";

export default async function About() {
  // Fetch total number of Superfund sites
  const { count: siteCount, error: countError } = await supabase
    .from("sites")
    .select("*", { head: true, count: "exact" });
  if (countError) {
    throw new Error("Error fetching site count");
  }
  // Fetch acres for all sites to compute total acreage
  const { data: sitesWithAcres, error: acresError } = await supabase
    .from("sites")
    .select("acres");
  if (acresError) {
    console.error("Error fetching site acreage", acresError);
  }
  const totalAcreage = 11_486_864.17;
  const totalSqMiles = 17_948;
  const avgAcres = Math.round(totalAcreage / (sitesWithAcres?.length ?? 1));
  const avgSqMiles = Math.round(totalSqMiles / (sitesWithAcres?.length ?? 1));

  return [
    <HeaderRoot key="header">
      <HeaderTitle>
        What is <a href="https://www.epa.gov/superfund">Superfund</a>?
      </HeaderTitle>
    </HeaderRoot>,
    <article
      className="prose prose-neutral prose-a:text-primary prose-a:underline-offset-3 prose-p:text-pretty prose-sm"
      key="article"
    >
      <p>
        Thousands of contaminated sites exist nationally due to hazardous waste
        being dumped, left out in the open, or otherwise improperly managed.
        These sites include manufacturing facilities, processing plants,
        landfills and mining sites.
      </p>
      <p>
        In the late 1970s, toxic waste dumps such as{" "}
        <Link href="/sites/NYD000606947">Love&nbsp;Canal</Link> and{" "}
        <Link href="/sites/KYD980500961">Valley of the Drums</Link> received
        national attention when the public learned about the risks to human
        health and the environment posed by contaminated sites.
      </p>
      <p>
        In response, Congress established the{" "}
        <a href="https://www.epa.gov/superfund/superfund-cercla-overview">
          Comprehensive Environmental Response, Compensation and Liability Act
          (CERCLA)
        </a>{" "}
        in 1980.
      </p>
      <p>
        CERCLA is informally called Superfund. It allows EPA to clean up
        contaminated sites. It also forces the parties responsible for the
        contamination to either perform cleanups or reimburse the government for
        EPA-led cleanup work.
      </p>
      <p>
        When there is no viable responsible party, Superfund gives EPA the funds
        and authority to clean up contaminated sites.
      </p>
      <p>Superfund’s goals are to:</p>
      <ul className="">
        <li>
          <a href="https://www.epa.gov/superfund/superfund-cleanup-process">
            Protect human health and the environment by cleaning up contaminated
            sites
          </a>
          ;
        </li>
        <li>
          <a href="https://www.epa.gov/enforcement/superfund-enforcement">
            Make responsible parties pay for cleanup work
          </a>
          ;
        </li>
        <li>
          <a href="https://www.epa.gov/superfund/superfund-community-involvement">
            Involve communities in the Superfund process
          </a>
          ; and
        </li>
        <li>
          <a href="https://www.epa.gov/superfund-redevelopment">
            Return Superfund sites to productive use
          </a>
          .
        </li>
      </ul>
      <p>
        Learn more about{" "}
        <a href="https://www.epa.gov/superfund/superfund-cleanup-process">
          the process EPA uses to clean up Superfund sites
        </a>
        .
      </p>
      <p>
        Source: <a href="https://www.epa.gov/superfund/what-superfund">EPA</a>.
      </p>
    </article>,
    <hr key="hr1" className="border-black/20 -mx-6 my-6" />,
    <section key="stats" className="">
      <Heading>Stats</Heading>
      <dl className="mt-4">
        <dt className="text-7xl font-sans leading-none tracking-tighter text-trim-both md:-ml-1">
          {siteCount?.toLocaleString()}
        </dt>
        <dd className="mt-4 mb-8 text-sm uppercase block text-neutral-600">
          Total sites
        </dd>
        <dt className="text-7xl font-sans leading-none tracking-tighter text-trim-both md:-ml-1">
          {totalSqMiles.toLocaleString()}
        </dt>
        <dd className="mt-4 mb-8 text-sm uppercase block text-neutral-600">
          Toxic square miles (2x Maryland)
        </dd>
        <dt className="text-7xl font-sans leading-none tracking-tighter text-trim-both md:-ml-1">
          {avgSqMiles.toLocaleString()}
        </dt>
        <dd className="mt-4 text-sm uppercase block text-neutral-600">
          Average site size (miles<sup>2</sup>)
        </dd>
      </dl>
    </section>,
    <hr key="hr2" className="border-black/20 -mx-6 my-6" />,
    <section
      key="author"
      className="prose prose-neutral prose-a:text-primary prose-a:underline-offset-3 prose-p:text-pretty prose-sm"
    >
      <Heading>About this site</Heading>
      <p>
        <a href="https://lachlanjc.com">Lachlan Campbell</a> made this website.
        It’s <a href="https://github.com/lachlanjc/superfund">open source</a>.
      </p>
      <p>
        It scrapes content off U.S. EPA’s Superfund website, and generates
        accessible summaries of sites and real-time answers to questions based
        on that material. The summaries are generated using{" "}
        <a href="https://openai.com">OpenAI</a>’s GPT-4.1 model. The site is
        built using <a href="https://nextjs.org">Next.js</a> and{" "}
        <a href="https://supabase.com">Supabase</a>.
      </p>
    </section>,
  ];
}
