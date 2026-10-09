import type { Metadata } from "next";

export const metadata: Metadata = { title: "App" };

/**
 * Layout for the learning app at `/app`.
 * @param {LayoutProps<"/app">} props `children`: the app page.
 * @returns {JSX.Element} The app.
 */
export default function AppLayout({ children }: LayoutProps<"/app">) {
  return children;
}
