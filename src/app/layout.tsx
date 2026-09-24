import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { isDemoMode } from "@/lib/demo";
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
  title: "Pathfinder",
  description: "Structured learning paths from zero to competent in any skill.",
};

// Applies the saved (or system) theme before first paint to avoid a flash.
const themeScript = `try{var t=localStorage.getItem("pathfinder:theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`;

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
        {isDemoMode() && (
          <div className="bg-indigo-600 px-4 py-2 text-center text-sm text-white">
            Demo version: full sample paths for <strong>guitar</strong>, <strong>public speaking</strong> and{" "}
            <strong>python</strong>. Other topics get a general template.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
