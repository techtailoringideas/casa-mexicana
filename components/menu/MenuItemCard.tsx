"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import type { MenuItem } from "@/data/menu";
import VegBadge from "@/components/ui/VegBadge";
import TagBadge from "@/components/ui/TagBadge";
import { useCart } from "@/store/useCart";
import Image from "next/image";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);

  const handleAdd = (price: number, variantLabel?: string) => {
    addItem({
      id: item.id,
      name: item.name,
      variantLabel,
      price,
    });
    openCart();
  };

  const displayPrice = item.price ?? item.variants?.[0]?.price ?? 0;

  return (
    <motion.div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
      whileHover={undefined}
      transition={{ duration: 0.3 }}
    >
      {/* Image area — fixed 4:3 aspect ratio */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 group">
        {/* CONDITIONAL IMAGE RENDER */}
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Fallback Placeholder (shows if no image is provided) */
          <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            <div className="text-center opacity-30">
              <span className="font-caveat text-3xl text-earth-dark/40">
                Casa
              </span>
            </div>
          </div>
        )}

        {/* Badge */}
        {item.badge && (
          <div className="absolute top-3 left-3 z-10">
            <TagBadge tag={item.badge} />
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="p-4 flex flex-col flex-1">
        {/* Name row: veg badge + name */}
        <div className="flex items-center gap-2 mb-1.5">
          {item.isVeg && <VegBadge />}
          <h3 className="font-playfair text-base font-bold text-earth-dark leading-tight">
            {item.name}
          </h3>
        </div>

        {/* Description — 2-line clamp */}
        <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3 flex-1">
          {item.description}
        </p>

        {/* Price + Add button */}
        {item.variants ? (
          <div className="space-y-2">
            {item.variants.map((v) => (
              <div key={v.label} className="flex items-center justify-between">
                <span className="text-sm text-body">
                  {v.label} <span className="currency-symbol">Rs</span>{" "}
                  <span className="text-earth-dark font-medium">{v.price}</span>
                </span>
                <button
                  onClick={() => handleAdd(v.price, v.label)}
                  className="w-8 h-8 rounded-full bg-pink/10 text-pink hover:bg-pink hover:text-white transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                  aria-label={`Add ${item.name} ${v.label} to cart`}
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-body">
              <span className="currency-symbol">Rs</span>{" "}
              <span className="text-earth-dark font-medium">
                {displayPrice}
              </span>
            </span>
            <button
              onClick={() => handleAdd(displayPrice)}
              className="w-8 h-8 rounded-full bg-pink/10 text-pink hover:bg-pink hover:text-white transition-colors duration-200 flex items-center justify-center flex-shrink-0"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
