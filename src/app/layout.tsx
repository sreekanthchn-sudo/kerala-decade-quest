import type { Metadata } from "next";
import { Manjari } from "next/font/google";
import "./globals.css";

const manjari = Manjari({
  variable: "--font-manjari",
  subsets: ["latin", "malayalam"],
  weight: ["100", "400", "700"],
});

export const metadata: Metadata = {
  title: "Kerala Decade Quest (2016–2026)",
  description:
    "Kerala's 10-year governance quiz — 21 ministries, compare Kerala vs National benchmarks.",
  keywords: ["Kerala", "governance", "quiz", "development", "LIFE Mission", "KIIFB"],
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manjari.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
