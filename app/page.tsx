import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import MenuSection from "@/components/sections/MenuSection";
import Reviews from "@/components/sections/Reviews";
import LocationMap from "@/components/sections/LocationMap";
import CartDrawer from "@/components/cart/CartDrawer";
import ReservationModal from "@/components/booking/ReservationModal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        {/* Section 1: Hero (image + 2 CTAs) */}
        <Hero />

        {/* Section 2: Menu (tabs + card grid with images) */}
        <MenuSection />

        {/* Section 3: Reviews (3 cards) */}
        <Reviews />

        {/* Section 4: Location + Map + Hours + Contact */}
        <LocationMap />
      </main>

      {/* Section 5: Footer */}
      <Footer />

      {/* Overlays */}
      <CartDrawer />
      <ReservationModal />
    </>
  );
}
