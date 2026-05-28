import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk, Instrument_Serif } from "next/font/google";
import "./globals.css";

// Primary sans (body, UI) — Inter, matching Cofounder's font-sans.
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Display / brand font — Space Grotesk, the closest free analog to
// Cofounder's proprietary TT Neoris geometric display face.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

// Monospace — JetBrains Mono for code, metrics, terminal-style UI.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

// Editorial serif — Instrument Serif, used sparingly for accents.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harbor Eval Canvas",
  description: "Visual AI evaluation creation platform. Build, probe, and validate model evaluations with precision.",
  openGraph: {
    title: "Harbor Eval Canvas",
    description: "Visual AI evaluation creation platform",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Harbor Eval Canvas",
    description: "Visual AI evaluation creation platform",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#FAFAF9",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
