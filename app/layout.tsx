import type { Metadata, Viewport } from "next";
import {
  Playfair_Display,
  DM_Sans,
  Caveat,
  Bebas_Neue,
  Great_Vibes,
  Comfortaa,
} from "next/font/google";
import { getLocalBusinessSchema } from "@/lib/schema";
import { siteConfig } from "@/data/site";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-caveat",
  display: "swap",
});
const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-breathing",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#2D1B0E",
};

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: `Authentic Mexican cuisine in Kathmandu, Nepal since ${siteConfig.since}. Tacos, burritos, enchiladas, fresh guacamole & more. Dine-in or order via WhatsApp.`,
  keywords: [
    "Casa Mexicana",
    "Mexican food Kathmandu",
    "tacos Kathmandu",
    "burritos Nepal",
    "Mexican restaurant Nepal",
    "best Mexican food KTM",
    "Gairidhara restaurant",
  ],
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description:
      "Authentic Mexican cuisine in the heart of Kathmandu. Tacos, burritos, enchiladas & more.",
    url: "https://casamexicana.com.np",
    siteName: siteConfig.name,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Casa Mexicana — Authentic Mexican Food in Kathmandu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: "Authentic Mexican cuisine in the heart of Kathmandu.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://casamexicana.com.np",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = getLocalBusinessSchema();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dmSans.variable} ${caveat.variable} ${bebasNeue.variable} ${greatVibes.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-cream antialiased">
        {children}

        {/* GA4 — replace G-XXXXXXX with real ID */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXXX');
            `,
          }}
        />
      </body>
    </html>
  );
}
