import type { Metadata } from "next";
import { Manjari } from "next/font/google";
import "./globals.css";

const malayalamFont = Manjari({
  variable: "--font-manjari",
  subsets: ["malayalam", "latin"],
  weight: ["100", "400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.knowkeralam.com"),
  title: "KNOW-KERALAM (2016-2026) · knowkeralam.com",
  description:
    "KNOW-KERALAM - അടുത്തറിയാം കഴിഞ്ഞ ഒരു ദശകത്തിന്റെ നേട്ടങ്ങൾ - 21 വകുപ്പുകൾ, ഓരോ റൗണ്ടിൽ 10 ചോദ്യങ്ങൾ. knowkeralam.com",
  keywords: ["KNOW-KERALAM", "knowkeralam", "കേരളം", "ഭരണം", "ക്വിസ്", "വികസനം", "LIFE Mission", "KIIFB"],
  openGraph: {
    title: "KNOW-KERALAM (2016-2026) · knowkeralam.com",
    description:
      "KNOW-KERALAM - അടുത്തറിയാം കഴിഞ്ഞ ഒരു ദശകത്തിന്റെ നേട്ടങ്ങൾ - 21 വകുപ്പുകൾ, ഓരോ റൗണ്ടിൽ 10 ചോദ്യങ്ങൾ. knowkeralam.com",
    images: [
      {
        url: "/knowkeralam.png",
        width: 1024,
        height: 1024,
        alt: "KNOW-KERALAM",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KNOW-KERALAM (2016-2026) · knowkeralam.com",
    description:
      "KNOW-KERALAM - അടുത്തറിയാം കഴിഞ്ഞ ഒരു ദശകത്തിന്റെ നേട്ടങ്ങൾ - 21 വകുപ്പുകൾ, ഓരോ റൗണ്ടിൽ 10 ചോദ്യങ്ങൾ. knowkeralam.com",
    images: ["/knowkeralam.png"],
  },
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
    <html lang="ml" data-theme="dark">
      <body className={`${malayalamFont.className} ${malayalamFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
