import type { Metadata } from "next";
import { Suspense } from "react";
import { DemoBanner } from "@/components/DemoBanner";

export const metadata: Metadata = { title: "App" };

/**
 * Layout for the learning app at `/app`: adds the demo banner above the app (the website at `/` doesn't show it).
 * @param {LayoutProps<"/app">} props `children`: the app page.
 * @returns {JSX.Element} The banner and the app.
 */
export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <>
      <Suspense fallback={null}>
        <DemoBanner />
      </Suspense>
      {children}
    </>
  );
}
