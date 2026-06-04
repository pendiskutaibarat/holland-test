import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Geist } from "next/font/google";
import { Suspense } from "react";
import TopLoadingBar from "@/components/TopLoadingBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="id" className={`${geistSans.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        <Suspense fallback={null}>
          <TopLoadingBar />
        </Suspense>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
