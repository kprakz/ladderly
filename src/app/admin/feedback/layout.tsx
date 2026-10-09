import type { Metadata } from "next";

export const metadata: Metadata = { title: "Feedback", robots: { index: false, follow: false } };

/**
 * Layout for the private feedback inbox: keeps it out of search engines.
 * @param {LayoutProps<"/admin/feedback">} props `children`: the inbox page.
 * @returns {JSX.Element} The page.
 */
export default function FeedbackAdminLayout({ children }: LayoutProps<"/admin/feedback">) {
  return children;
}
