import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Familjen_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";

const familjenGrotesk = Familjen_Grotesk({
  variable: "--font-familjen-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
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
        className={`${familjenGrotesk.variable} ${martianMono.variable} antialiased`}
        data-appearance="light"
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
