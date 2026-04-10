import type { Metadata } from "next";
import { siteConfig } from "@/data/site";
import { getMenuSchema } from "@/lib/schema";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MenuSection from "@/components/sections/MenuSection";
import CartDrawer from "@/components/cart/CartDrawer";

export const metadata: Metadata = {
  title: `Menu — ${siteConfig.name} | Authentic Mexican Food in Kathmandu`,
  description:
    "Browse the full menu of Casa Mexicana Kathmandu. Tacos, burritos, enchiladas, nachos, fresh guacamole, Mexican drinks & desserts. Order via WhatsApp.",
  openGraph: {
    title: `Menu — ${siteConfig.name}`,
    description: "Full menu with prices. Authentic Mexican cuisine in Kathmandu.",
  },
};

export default function MenuPage() {
  const menuJsonLd = getMenuSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(menuJsonLd) }}
      />
      <Navbar />
      <main className="pt-20">
        <MenuSection />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}
