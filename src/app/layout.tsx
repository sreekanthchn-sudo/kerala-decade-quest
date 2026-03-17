import type { Metadata } from "next";
import { Manjari } from "next/font/google";
import "./globals.css";

const manjari = Manjari({
  variable: "--font-manjari",
  subsets: ["latin", "malayalam"],
  weight: ["100", "400", "700"],
});

export const metadata: Metadata = {
  title: "നവകേരള ക്വിസ് (2016–2026)",
  description:
    "അടുത്തറിയാം കഴിഞ്ഞ ഒരു ദശകത്തിന്റെ നേട്ടങ്ങൾ — 21 വകുപ്പുകൾ, 315 ചോദ്യങ്ങൾ",
  keywords: ["കേരളം", "ഭരണം", "ക്വിസ്", "വികസനം", "LIFE Mission", "KIIFB"],
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
    <html lang="ml">
      <body className={`${manjari.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
