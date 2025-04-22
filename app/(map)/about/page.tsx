import { HeaderRoot, HeaderTitle } from "@/lib/ui/header";
import { Heading } from "@/lib/ui/typography";
import Link from "next/link";
import { groupings } from "../sites/[site]/contaminants";
import clsx from "clsx";

export default function About() {
  return [
    <HeaderRoot showClose key="header">
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
    <section key="media">
      <Heading>Types of contamination</Heading>
      <ul className="flex flex-col gap-4" role="list">
        {Object.keys(groupings)
          .filter((key) => key !== "other")
          .map((key) => {
            const media = groupings[key as keyof typeof groupings];
            const Icon = media.icon;
            return (
              <li
                key={key}
                className="grid grid-cols-[auto_1fr] w-full gap-x-4 items-start md:max-w-md py-2"
              >
                <Icon
                  width={48}
                  height={48}
                  className={clsx(media.color, "-ml-2")}
                  aria-hidden
                />
                <div>
                  <strong className="font-sans text-lg md:text-2xl font-medium text-black">
                    {media.label || key}
                  </strong>
                  {media.desc && (
                    <p className="mt-1 text-pretty text-neutral-600">
                      {media.desc}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
      </ul>
    </section>,
  ];
}
