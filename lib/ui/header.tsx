"use client";

import { LinkProps } from "next/link";
import { Link } from "next-view-transitions";
import { Drawer } from "vaul";
import { Title } from "./typography";
// import { usePathname } from "next/navigation";
import { ComponentProps, ReactNode } from "react";
import SvgChevronRight from "../icons/ChevronRight";

export const Header = {
  Root: HeaderRoot,
  Title: HeaderTitle,
  Subtitle: HeaderSubtitle,
};

export function HeaderRoot({
  showClose,
  closeLink = "/",
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
      className="mb-4 flex gap-2 md:gap-4 relative items-start"
      data-appearance="dark"
    >
      <div className="flex flex-col mr-auto">{children}</div>
      {actions}
      {showClose && (
        <Link
          href={closeLink}
          className="flex h-8 w-8 shrink-0 leading-0 items-center justify-center rounded-full bg-black/10 transition-transform hover:scale-110 will-change-transform focus-visible:shadow-focus-ring-button active:scale-75"
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
      className="flex items-end text-base font-sans font-medium text-neutral-600 mb-1"
      style={{ viewTransitionName: "header-breadcrumb" }}
    >
      {children}
      <SvgChevronRight width={20} height={20} aria-hidden />
    </Link>
  );
}

export function HeaderTitle(props: ComponentProps<typeof Title>) {
  return (
    <Drawer.Title asChild>
      <Title {...props} />
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
