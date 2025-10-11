"use client";
import clsx from "clsx";
import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { Heading, Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import Webcam from "react-webcam";
import {
  contaminantCategories,
  contaminantContexts,
} from "@/lib/data/contaminants";
import imgCreek from "@/public/show/centre/creek.jpg";
// import imgKepone from "@/public/show/centre/kepone.jpg";
// import imgPreschool from "@/public/show/centre/preschool.jpg";
import imgSheetz from "@/public/show/centre/sheetz.jpg";

interface ItemProps {
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
  },
  {
    id: "sheetz",
    color: "bg-red-500",
    name: "Sheetz Gas Station",
    desc: "Below the preschool sat a Sheetz, a popular PA gas station. In 2006, it “lost an undetermined amount of gasoline,” spilling storage tanks of gas into Spring Creek. Sheetz paid just $8500 in fines, while the creek was designated as catch & release for fishing. It was later demolished.",
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
      className={clsx(
        "flex w-full items-center gap-6 text-left",
        "py-4 pr-6 pl-4 md:pl-6",
        "border-white/20 border-t",
        "cursor-pointer snap-start overflow-x-hidden",
        "transition-colors hover:bg-white/10 data-[selected]:bg-white/20"
      )}
      id={id}
    >
      <Heading className="flex items-center text-balance font-bold font-sans text-2xl/6">
        <span
          className={`mr-1 inline-block h-[1.375em] w-[1.375em] shrink-0 origin-left scale-75 rounded-full text-center text-white ${color}`}
        >
          {i}
        </span>
        {name}
      </Heading>
    </Tab>
  );
}

function LandmarkTabPanel({
  // color,
  id,
  name,
  desc,
  img,
  imgCredit,
}: ItemProps) {
  return (
    <TabPanel
      className={clsx(
        "details-content",
        "p-4 pr-6 md:pl-6",
        "text-base text-neutral-300",
        "overflow-y-auto"
        // "grid grid-cols-[2fr_1fr] gap-4",
      )}
      id={id}
    >
      <div>
        <p className="mb-6 max-w-2xl text-pretty font-mono">{desc}</p>
        {id === "site" && (
          <Link
            className="action-button mb-4 flex cursor-pointer items-center justify-center gap-2 py-1.5 font-medium font-sans text-base"
            href="/sites/PAD000436261"
          >
            Explore the site
          </Link>
        )}
      </div>

      {img && (
        <figure className="pb-4 font-mono text-xs">
          <Image
            alt={name}
            className="mb-2 max-h-sm rounded-xl"
            placeholder="blur"
            src={img}
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
      className="grid max-h-full grid-cols-[1fr_2fr] border-white/20 border-t"
      orientation="vertical"
    >
      <TabList aria-label="Landmarks" className="border-white/20 border-r">
        {landmarks.map((item, i) => (
          <LandmarkTab i={i + 1} key={item.id} {...item} />
        ))}
      </TabList>
      {landmarks.map((item) => (
        <LandmarkTabPanel key={item.id} {...item} />
      ))}
    </Tabs>
  );
}

function Mobile() {
  return (
    <article className="grid w-fit grid-cols-3 grid-rows-[auto_repeat(8,auto)] gap-x-4 gap-y-4">
      {Object.entries(contaminantCategories).map(([key, category], i) => (
        <section
          className={clsx(
            "grid grid-rows-subgrid",
            key === "other"
              ? "col-start-3 row-start-5 row-end-8"
              : `col-start-${i + 1} row-start-1 row-end-8`
          )}
          key={key}
        >
          <h1 className="self-end font-bold font-sans text-3xl tracking-tight">
            {category.name}
          </h1>
          <ul className={clsx("contents")}>
            {category.contexts
              // .filter((key) => key !== "other")
              .map((ctxKey) => {
                const context = contaminantContexts[ctxKey];
                const Icon = context.icon;
                return (
                  <li
                    className="grid w-full grid-cols-[auto_1fr] items-start gap-x-2 md:max-w-md"
                    key={ctxKey}
                  >
                    <Icon
                      aria-hidden
                      className={clsx(category.color, "-ml-1")}
                      height={48}
                      width={48}
                    />
                    <div>
                      <strong className="font-medium font-sans text-lg md:text-xl">
                        {context.name}
                      </strong>
                      {context.desc && (
                        <p className="mt-1 text-pretty font-mono text-neutral-400 text-xs leading-relaxed">
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
        className="absolute z-0 h-screen w-screen object-cover"
        videoConstraints={{ facingMode: "environment" }}
      />
      <article
        className="main-card -translate-x-1/2 absolute top-8 left-1/2 w-full overflow-y-auto rounded-xl backdrop-blur-lg backdrop-saturate-175 md:rounded-2xl"
        style={{
          maxWidth: "min(100vi - 32px, 68rem)",
          maxHeight: "calc(100svb - 64px)",
        }}
      >
        <Tabs className="w-full">
          <header className="p-4">
            <TabList className="grid grid-cols-2 gap-1 rounded-xl bg-black/10 p-1 text-center font-medium font-sans text-base text-neutral-700">
              <Tab
                className="active-tab px-4 py-3 text-trim-both"
                id="landmarks"
              >
                Map: Landmarks
              </Tab>
              <Tab className="active-tab px-4 py-3 text-trim-both" id="mobile">
                Mobile: Types of Contamination
              </Tab>
            </TabList>
          </header>

          <TabPanel className="" id="landmarks">
            <Landmarks />
          </TabPanel>

          <TabPanel className="p-4 pt-0" id="mobile">
            <Mobile />
          </TabPanel>
        </Tabs>
      </article>
    </main>
  );
}
