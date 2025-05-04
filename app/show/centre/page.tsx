"use client";
import { IconComponent } from "@/lib/util/types";
import clsx from "clsx";
// import { useRef, useEffect } from "react";
import {
  Button,
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  Heading,
} from "react-aria-components";
// import { useDisclosureState } from "react-stately";
import Webcam from "react-webcam";

interface ItemProps {
  icon?: IconComponent;
  id: string;
  name: string;
  desc?: string;
}

const landmarks: Array<ItemProps> = [
  {
    id: "preschool",
    name: "Nittany Valley Montessori School",
    desc: "A private preschool located in the Nittany Valley.",
  },
  {
    id: "sheetz",
    name: "Sheetz Gas Station",
    desc: "A popular gas station and convenience store chain.",
  },
  {
    id: "creek",
    name: "Spring Creek",
    desc: "A creek that runs through the area, known for its natural beauty.",
  },
  {
    id: "gardens",
    name: "College Gardens",
    desc: "A plant store.",
  },
  {
    id: "site",
    name: "Centre County Kepone",
    desc: "The Superfund site of a former chemical plant that produced Kepone, a pesticide.",
  },
];

function Item({ i, icon: Icon, id, name, desc }: ItemProps & { i: number }) {
  // const state = useDisclosureState({});
  // const contentRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (!contentRef.current) return;
  //   if (state.isOpen) {
  //     contentRef.current.style.maxHeight = `${contentRef.current?.scrollHeight}px`;
  //   } else {
  //     contentRef.current.style.maxHeight = "0";
  //   }
  // }, [state.isOpen]);

  return (
    <Disclosure id={id} className="border-t border-white/20">
      <Button
        slot="trigger"
        className={clsx(
          "flex gap-6 items-center text-left w-full",
          "py-4 pl-4 pr-6 md:pl-6",
          // "border-b last:border-b-0 border-neutral-300 -outline-offset-2",
          "snap-start overflow-x-hidden cursor-pointer",
          "hover:bg-white/10 data-[selected]:bg-white transition-colors",
        )}
      >
        {Icon && <Icon width={20} height={20} className="mr-2" />}
        <Heading className="text-3xl font-sans font-bold">
          {i}. {name}
        </Heading>
      </Button>
      <DisclosurePanel
        className={clsx(
          "details-content",
          "pl-4 pr-6 md:pl-6",
          "text-neutral-300 text-base",
        )}
      >
        <p className="font-mono mb-6">{desc}</p>
      </DisclosurePanel>
    </Disclosure>
  );
}

const videoConstraints = {
  facingMode: "environment",
};

export default function Page() {
  return (
    <main data-appearance="dark">
      <Webcam
        videoConstraints={videoConstraints}
        className="absolute w-screen h-screen object-cover z-0"
      />
      <article
        className="main-card backdrop-blur-lg backdrop-saturate-150 rounded-xl md:rounded-2xl absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-full"
        style={{
          maxWidth: "min(100vi - 32px, 32rem)",
          maxHeight: "calc(100svb - 64px)",
        }}
      >
        <h1 className="text-balance font-bold font-sans tracking-tight text-6xl/8 text-center py-12">
          Landmarks
        </h1>
        <DisclosureGroup defaultExpandedKeys={["preschool"]}>
          {landmarks.map((item, i) => (
            <Item key={item.id} i={i + 1} {...item} />
          ))}
        </DisclosureGroup>
      </article>
    </main>
  );
}
