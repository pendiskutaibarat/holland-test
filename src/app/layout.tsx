import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tes Bakat Holland RIASEC",
  description:
    "Tes Kepribadian Holland RIASEC - Temukan tipe kepribadian dan karir yang cocok untukmu",
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
    <html lang="id" className={`${geistSans.variable} antialiased`}>
      <body className="min-h-screen bg-gray-100 text-gray-800 font-sans">
        {children}
      </body>
    </html>
  );
}
