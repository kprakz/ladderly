import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { DemoBanner } from "@/components/DemoBanner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ladderly",
  description: "Structured learning paths from zero to competent in any skill.",
};

// Applies the saved (or system) theme before first paint to avoid a flash.
// "night" is accepted too, from the retro themes' mood switch, so a saved dark choice carries over.
const themeScript = `try{var t=localStorage.getItem("ladderly:theme")||localStorage.getItem("pathfinder:theme");if(t==="dark"||t==="night"||((!t||(t!=="light"&&t!=="sunny"&&t!=="cloudy"))&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

/**
 * Root layout wrapping every page: fonts, theme script and the demo banner.
 * @param {LayoutProps<"/">} props `children`: the page to render.
 * @returns {JSX.Element} The full HTML document.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Suspense fallback={null}>
          <DemoBanner />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
