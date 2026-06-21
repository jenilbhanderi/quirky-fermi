import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/*
  ═══════════════════════════════════════════════════════════════
  FONT SETUP — How next/font/google works:
  We load 3 fonts:
  - Space Grotesk → Display/headlines (--font-display)
  - Inter         → Body text (--font-body)
  - JetBrains Mono → Technical/mono text (--font-mono)
  ═══════════════════════════════════════════════════════════════
*/

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
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

export const metadata = {
  title: {
    template: "%s | Hylunian AI",
    default: "Hylunian",
  },
  description:
    "Pioneering localized, high-efficiency cognitive architectures that bring physical intelligence to the edge of the network.",
  keywords: [
    "edge AI",
    "cognitive edge",
    "physical intelligence",
    "neuromorphic compute",
    "model quantization",
    "Hylunian",
  ],
  authors: [{ name: "Jenil Bhanderi" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hylunian.com",
    siteName: "Hylunian AI",
    title: "Hylunian",
    description:
      "Pioneering localized, high-efficiency cognitive architectures that bring physical intelligence to the edge of the network.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hylunian",
    description:
      "Pioneering localized, high-efficiency cognitive architectures that bring physical intelligence to the edge of the network.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-background text-text-primary antialiased">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}
