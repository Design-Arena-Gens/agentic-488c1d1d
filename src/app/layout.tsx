import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const display = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://agentic-488c1d1d.vercel.app"),
  title: "Miraç - Namaz Vakitleri, Ezan, Kıble",
  description:
    "Modern ve duyarlı bir İslami zaman yönetimi deneyimi: Namaz vakitleri, ezan hatırlatıcıları ve kıble pusulası tek uygulamada.",
  keywords: [
    "namaz vakitleri",
    "ezan",
    "kıble pusulası",
    "prayer times",
    "adhan",
    "qibla",
    "islamic",
    "müslüman",
    "vercel",
    "web app"
  ]
};

export const viewport = {
  themeColor: "#0f172a"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} bg-midnight-800`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
