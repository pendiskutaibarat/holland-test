import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/react";
import localFont from "next/font/local";
import { Suspense } from "react";
import GlobalNav from "@/components/GlobalNav";
import TopLoadingBar from "@/components/TopLoadingBar";
import "./globals.css";

const inter = localFont({
  src: [
    { path: "../../docs/fonts/Inter.woff2", weight: "400" },
    { path: "../../docs/fonts/Inter-500.woff2", weight: "500" },
    { path: "../../docs/fonts/Inter-600.woff2", weight: "600" },
  ],
  variable: "--font-inter",
});

const newsreader = localFont({
  src: "../../docs/fonts/Newsreader.woff2",
  variable: "--font-newsreader",
});

export const metadata: Metadata = {
  title: "Platform Asesmen Siswa",
  description:
    "Platform asesmen siswa untuk Holland RIASEC, Minat Hobi, dan asesmen lain.",
  icons: {
    icon: "favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${newsreader.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-slate-50 font-sans text-slate-800">
        <Suspense fallback={null}>
          <TopLoadingBar />
        </Suspense>
        <GlobalNav />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
