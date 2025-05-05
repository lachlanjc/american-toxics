"use client";
import {
  contaminantCategories,
  contaminantContexts,
} from "@/lib/data/contaminants";
import { IconComponent } from "@/lib/util/types";
import clsx from "clsx";
import Link from "next/link";
import { Heading, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import Webcam from "react-webcam";

import Image, { ImageProps } from "next/image";
import imgCreek from "@/public/show/centre/creek.jpg";
import imgPreschool from "@/public/show/centre/preschool.jpg";
import imgSheetz from "@/public/show/centre/sheetz.jpg";
import imgKepone from "@/public/show/centre/kepone.jpg";

interface ItemProps {
  icon?: IconComponent;
  color?: string;
  id: string;
  name: string;
  desc?: string;
  img?: ImageProps["src"];
  imgCredit?: string;
}

const landmarks: Array<ItemProps> = [
  {
    id: "preschool",
    color: "bg-white !text-black",
    name: "Nittany Valley Montessori School",
    desc: "This was my preschool, starting in 2004, a beautiful school with a pet rabbit, tiny fish pond, gardens, and play areas. Though it recently closed, I have incredibly fond memories of running around and learning here.",
    img: imgPreschool,
    imgCredit: "Christopher Campbell",
  },
  {
    id: "sheetz",
    color: "bg-red-500",
    name: "Sheetz Gas Station",
    desc: "In 2006, below the preschool, a popular PA chain gas station “lost an undetermined amount of gasoline,” spilling storage tanks of gas into Spring Creek. Sheetz paid just $8500 in fines, while the creek was designated as catch & release for fishing.",
    img: imgSheetz,
    imgCredit: "Google Maps Street View",
  },
  {
    id: "creek",
    color: "bg-blue-600",
    name: "Spring Creek",
    desc: "This beautiful 25-mile creek runs through the area, with a park across the street from the preschool I used to play at. Also called “Fishermen’s Paradise,” it’s the most densely populated trout stream in the state, but it has suffered decades of raw sewage dumping, chemical runoff, and multiple gasoline spills, making the fish unsafe for consumption throughout the 2000s.",
    img: imgCreek,
    imgCredit: "Wikimedia",
  },
  {
    id: "site",
    color: "bg-yellow-500",
    name: "Centre County Kepone",
    desc: "A former chemical plant, opened in the 1950s, produced Kepone & Mirex, insecticide & flame retardant respectively, both banned by 1976 due to being extremely carcinogenic, toxic, & bioaccumulative. The plant became a Superfund site in 1981, but manufacturing of other chemicals continued until 2004, with wastes dumped into the soil and sprayed into the air. Thousands of people live within a mile, directly bordering the site. Today, it remains fenced.",
    img: imgKepone,
    imgCredit: "Alexis Oltmer",
  },
  {
    id: "gardens",
    color: "bg-teal-600",
    name: "College Gardens",
    desc: "Employees at this plant store, directly across the street from the Superfund site, report that plants left out overnight while the site was active would be dead by morning.",
  },
];

function LandmarkTab({ i, color, id, name }: ItemProps & { i: number }) {
  return (
    <Tab
      id={id}
      className={clsx(
        "flex gap-6 items-center text-left w-full",
        "py-4 pl-4 pr-6 md:pl-6",
        "border-t border-white/20",
        "snap-start overflow-x-hidden cursor-pointer",
        "hover:bg-white/10 data-[selected]:bg-white/20 transition-colors",
      )}
    >
      <Heading className="flex items-center text-2xl/6 text-balance font-sans font-bold">
        <span
          className={`w-[1.375em] h-[1.375em] scale-75 origin-left inline-block text-center mr-1 rounded-full text-white shrink-0 ${color}`}
        >
          {i}
        </span>
        {name}
      </Heading>
    </Tab>
  );
}

function LandmarkTabPanel({
  i,
  color,
  id,
  name,
  desc,
  img,
  imgCredit,
}: ItemProps) {
  return (
    <TabPanel
      id={id}
      className={clsx(
        "details-content",
        "p-4 pr-6 md:pl-6",
        "text-neutral-300 text-base",
        "overflow-y-auto",
        // "grid grid-cols-[2fr_1fr] gap-4",
      )}
    >
      <div>
        <p className="font-mono mb-6 max-w-2xl text-pretty">{desc}</p>
        {id === "site" && (
          <Link
            href="/sites/PAD000436261"
            className="action-button cursor-pointer font-sans font-medium text-base py-1.5 gap-2 flex items-center justify-center mb-4"
          >
            Explore the site
          </Link>
        )}
      </div>

      {img && (
        <figure className="pb-4 font-mono text-xs">
          <Image
            src={img}
            alt={name}
            className="rounded-xl mb-2 max-h-sm"
            placeholder="blur"
          />
          <figcaption>Photo via {imgCredit}</figcaption>
        </figure>
      )}
    </TabPanel>
  );
}

function Landmarks() {
  return (
    <Tabs
      orientation="vertical"
      className="grid grid-cols-[1fr_2fr] border-t border-white/20 max-h-full"
    >
      <TabList aria-label="Landmarks" className="border-r border-white/20">
        {landmarks.map((item, i) => (
          <LandmarkTab key={item.id} i={i + 1} {...item} />
        ))}
      </TabList>
      {landmarks.map((item, i) => (
        <LandmarkTabPanel key={item.id} i={i + 1} {...item} />
      ))}
    </Tabs>
  );
}

function Mobile() {
  return (
    <article className="w-fit grid grid-cols-3 grid-rows-[auto_repeat(8,auto)] gap-x-4 gap-y-4">
      {Object.entries(contaminantCategories).map(([key, category], i) => (
        <section
          key={key}
          className={clsx(
            "grid grid-rows-subgrid",
            key === "other"
              ? `col-start-3 row-start-5 row-end-8`
              : `col-start-${i + 1} row-start-1 row-end-8`,
          )}
        >
          <h1 className="font-bold font-sans text-3xl tracking-tight self-end">
            {category.name}
          </h1>
          <ul className={clsx("contents")} role="list">
            {category.contexts
              // .filter((key) => key !== "other")
              .map((ctxKey) => {
                const context = contaminantContexts[ctxKey];
                const Icon = context.icon;
                return (
                  <li
                    key={ctxKey}
                    className="grid grid-cols-[auto_1fr] w-full gap-x-2 items-start md:max-w-md"
                  >
                    <Icon
                      width={48}
                      height={48}
                      className={clsx(category.color, "-ml-1")}
                      aria-hidden
                    />
                    <div>
                      <strong className="font-sans text-lg md:text-xl font-medium">
                        {context.name}
                      </strong>
                      {context.desc && (
                        <p className="mt-1 text-pretty text-neutral-400 font-mono text-xs leading-relaxed">
                          {context.desc}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </article>
  );
}

export default function Page() {
  return (
    <main data-appearance="dark">
      <Webcam
        videoConstraints={{ facingMode: "environment" }}
        className="absolute w-screen h-screen object-cover z-0"
      />
      <article
        className="main-card backdrop-blur-lg backdrop-saturate-175 rounded-xl md:rounded-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full overflow-y-auto"
        style={{
          maxWidth: "min(100vi - 32px, 68rem)",
          maxHeight: "calc(100svb - 64px)",
        }}
      >
        <Tabs className="w-full">
          <header className="p-4">
            <TabList className="grid grid-cols-2 bg-black/10 p-1 gap-1 rounded-xl font-sans font-medium text-neutral-700 text-base text-center">
              <Tab
                id="landmarks"
                className="active-tab px-4 py-3 text-trim-both"
              >
                Map: Landmarks
              </Tab>
              <Tab id="mobile" className="active-tab px-4 py-3 text-trim-both">
                Mobile: Types of Contamination
              </Tab>
            </TabList>
          </header>

          <TabPanel id="landmarks" className="">
            <Landmarks />
          </TabPanel>

          <TabPanel id="mobile" className="p-4 pt-0">
            <Mobile />
          </TabPanel>
        </Tabs>
      </article>
    </main>
  );
}
