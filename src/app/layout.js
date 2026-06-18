import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/*
  ═══════════════════════════════════════════════════════════════
  FONT SETUP — How next/font/google works:

  Next.js downloads these fonts at BUILD TIME and hosts them
  from your own domain. This means:
  1. No requests to Google's servers (better privacy)
  2. No layout shift while fonts load (better performance)
  3. The "variable" prop creates a CSS variable we can use
     in Tailwind or globals.css

  We load 3 fonts:
  - Space Grotesk → Display/headlines (--font-display)
  - Inter         → Body text (--font-body)
  - JetBrains Mono → Technical/mono text (--font-mono)
  ═══════════════════════════════════════════════════════════════
*/

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap", // Shows fallback font immediately, swaps when loaded
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

/*
  ═══════════════════════════════════════════════════════════════
  METADATA — SEO Configuration

  This object tells search engines and social media about your site.
  Next.js automatically generates the right <meta> tags from this.

  - title.template: Every page title will be "Page Name | Hylunian"
  - title.default: Used when a page doesn't set its own title
  - description: Shows up in Google search results
  - openGraph: Shows up when you share the link on Twitter/LinkedIn
  ═══════════════════════════════════════════════════════════════
*/
export const metadata = {
  title: {
    template: "%s | Hylunian",
    default: "Hylunian | Display that gives back.",
  },
  description:
    "Pioneering transparent piezoelectric and triboelectric (TENG) display interfaces that convert kinetic touch into self-sustaining electrical power.",
  keywords: [
    "piezoelectric display",
    "TENG",
    "energy harvesting",
    "transparent display",
    "self-powered display",
    "Hylunian",
  ],
  authors: [{ name: "Jenil Bhanderi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hylunian.com",
    siteName: "Hylunian",
    title: "Hylunian | Display that gives back.",
    description:
      "Pioneering transparent piezoelectric and triboelectric display interfaces.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hylunian | Display that gives back.",
    description:
      "Pioneering transparent piezoelectric and triboelectric display interfaces.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/*
  ═══════════════════════════════════════════════════════════════
  ROOT LAYOUT — The Shell of Every Page

  This component wraps EVERY page on your site. Think of it
  as the "frame" — the Navbar and Footer are always present,
  and the {children} slot is where each page's content goes.

  Structure:
  ┌─────────────────────────┐
  │        Navbar            │  ← Always visible
  ├─────────────────────────┤
  │                         │
  │     {children}          │  ← Changes per page
  │     (page content)      │
  │                         │
  ├─────────────────────────┤
  │        Footer            │  ← Always visible
  └─────────────────────────┘
  ═══════════════════════════════════════════════════════════════
*/
export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-text-primary antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
