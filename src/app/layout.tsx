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
      <body className={`${malayalamFont.className} ${malayalamFont.variable} flex min-h-dvh flex-col antialiased`}>
        {/* Reserve space for sticky footer */}
        <div className="flex-1 pb-[calc(3.25rem+env(safe-area-inset-bottom))]">{children}</div>
        <footer className="fixed inset-x-0 bottom-0 z-50 w-full border-t border-white/10 bg-[#0a0a0a]/90 px-4 py-2 text-center text-xs text-white/70 backdrop-blur">
          Developed by A community-driven initiative by Sameeksha UK &amp; the DYFI Professional Sub-committee.
        </footer>
      </body>
    </html>
  );
}
