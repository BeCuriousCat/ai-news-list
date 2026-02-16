import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI News List - GitHub Trending AI Repositories",
  description:
    "Daily collection of the hottest AI-related repositories from GitHub Trending",
  keywords: [
    "AI",
    "machine learning",
    "deep learning",
    "GitHub",
    "trending",
    "repositories",
    "RSS",
  ],
  alternates: {
    types: {
      "application/rss+xml": [
        { url: "/api/rss?since=daily", title: "AI News List - Daily" },
        { url: "/api/rss?since=weekly", title: "AI News List - Weekly" },
        { url: "/api/rss?since=monthly", title: "AI News List - Monthly" },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
