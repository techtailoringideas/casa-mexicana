"use client";

import { ShoppingBag, Calendar } from "lucide-react";
import { useCart } from "@/store/useCart";

export default function FloatingButtons() {
  const itemCount = useCart((s) => s.itemCount());
  const openCart = useCart((s) => s.openCart);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Cart button */}
      <button
        onClick={openCart}
        className="relative w-14 h-14 bg-[#00A896] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-earth-dark/90 transition-colors"
        aria-label="Open cart"
      >
        <ShoppingBag size={22} />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-pink text-white text-[11px] font-bold rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Book a Table button */}
      <button
        onClick={() => document.getElementById("open-reservation")?.click()}
        className="w-14 h-14 bg-pink text-white rounded-full shadow-lg shadow-pink/30 flex items-center justify-center hover:bg-pink-dark transition-colors"
        aria-label="Book a Table"
      >
        <Calendar size={22} />
      </button>
    </div>
  );
}
