"use client";

import { LinkProps } from "next/link";
import { Link } from "next-view-transitions";
import { Drawer } from "vaul";
import { Title } from "./typography";
// import { usePathname } from "next/navigation";
import { ComponentProps } from "react";

export const Header = {
  Root: HeaderRoot,
  Title: HeaderTitle,
  Subtitle: HeaderSubtitle,
};

export function HeaderRoot({
  showClose,
  children,
}: React.PropsWithChildren<{ showClose?: boolean }>) {
  // const pathname = usePathname();
  return (
    <header className="mb-4 flex gap-2 md:gap-4 relative">
      <div className="flex flex-col">{children}</div>
      {showClose && (
        <Link
          href="/"
          className="ml-auto flex h-8 w-8 shrink-0 leading-0 items-center justify-center rounded-full bg-black/10 transition-transform focus:scale-95 focus-visible:shadow-focus-ring-button active:scale-75"
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
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#777"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
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
      href={href}
      className="text-sm font-sans font-medium text-neutral-600 mb-1"
      style={{ viewTransitionName: "header-breadcrumb" }}
    >
      &larr; {children}
    </Link>
  );
}

export function HeaderTitle(props: ComponentProps<typeof Title>) {
  return (
    <Drawer.Title asChild>
      <Title style={{ viewTransitionName: "header-title" }} {...props} />
    </Drawer.Title>
  );
}

export function HeaderSubtitle({ children }: React.PropsWithChildren<object>) {
  return (
    <p
      className="text-sm text-neutral-600 text-pretty mt-2"
      style={{ viewTransitionName: "header-subtitle" }}
    >
      {children}
    </p>
  );
}
