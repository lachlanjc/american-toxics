import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

const gtMechanik = localFont({
  src: "./GT-Mechanik-VF.woff2",
  display: "swap",
  variable: "--font-gt-mechanik",
});

const title = "American Toxics";
const description = "Explore Superfund toxic waste sites across the U.S.";
export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description },
  alternates: {
    canonical: new URL("https://americantoxics.com"),
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${gtMechanik.variable} antialiased`}
        data-appearance="light"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
