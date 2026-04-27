"use client";

// import { usePathname } from "next/navigation";
import { Drawer } from "@base-ui/react/drawer";
import Link, { type LinkProps } from "next/link";
import type { ComponentProps, ReactNode } from "react";
import SvgChevronRight from "../icons/ChevronRight";
import { Title } from "./typography";

export const Header = {
  Root: HeaderRoot,
  Title: HeaderTitle,
  Subtitle: HeaderSubtitle,
};

export function HeaderRoot({
  closeLink = "/",
  showClose = true,
  actions,
  children,
}: React.PropsWithChildren<{
  showClose?: boolean;
  closeLink?: string;
  actions?: ReactNode;
}>) {
  // const pathname = usePathname();
  return (
    <header
      className="relative mb-4 flex items-start gap-2 md:gap-4"
      data-appearance="dark"
    >
      <div className="mr-auto flex flex-col">{children}</div>
      {actions}
      {showClose && (
        <Link
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/10 leading-0 transition-transform will-change-transform hover:scale-110 focus-visible:shadow-focus-ring-button active:scale-75"
          href={closeLink}
          onClick={() => {
            // @ts-expect-error global
            window.mapRef?.current?.flyTo({
              // @ts-expect-error global
              zoom: Math.max(window.mapRef?.current?.getZoom() - 2, 0),
              duration: 1000,
            });
          }}
        >
          <svg
            fill="none"
            height="12"
            stroke="#777"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            viewBox="0 0 12 12"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Close</title>
            <path d="M10.4854 1.99998L2.00007 10.4853" />
            <path d="M10.4854 10.4844L2.00007 1.99908" />
          </svg>
        </Link>
      )}
    </header>
  );
}

export function HeaderBreadcrumb({
  href,
  children,
}: React.PropsWithChildren<LinkProps>) {
  return (
    <Link
      className="mb-2 flex items-center font-semibold font-display text-base text-neutral-600"
      href={href}
      style={{ viewTransitionName: "header-breadcrumb" }}
    >
      {children}
      <SvgChevronRight aria-hidden height={20} width={20} />
    </Link>
  );
}

export function HeaderTitle(props: ComponentProps<typeof Title>) {
  return <Drawer.Title render={<Title {...props} />} />;
}

export function HeaderSubtitle({ children }: React.PropsWithChildren<object>) {
  return (
    <p
      className="mt-3 text-pretty text-neutral-600"
      style={{ viewTransitionName: "header-subtitle" }}
    >
      {children}
    </p>
  );
}
