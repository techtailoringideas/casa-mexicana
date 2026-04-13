"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import Image from "next/image";
import type { MenuItem } from "@/data/menu";
import VegBadge from "@/components/ui/VegBadge";
import TagBadge from "@/components/ui/TagBadge";
import { useCart } from "@/store/useCart";

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const [expanded, setExpanded] = useState(false);

  const handleAdd = (
    e: React.MouseEvent,
    price: number,
    variantLabel?: string,
  ) => {
    e.stopPropagation();
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
    <>
      {/* Normal card */}
      <motion.div
        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col cursor-pointer"
        whileHover={undefined}
        transition={{ duration: 0.3 }}
        onClick={() => setExpanded(true)}
      >
        {/* Image area — fixed 4:3 aspect ratio */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 group">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
              <div className="text-center opacity-30">
                <span className="font-caveat text-3xl text-earth-dark/40">
                  Casa
                </span>
              </div>
            </div>
          )}
          {item.badge && (
            <div className="absolute top-3 left-3 z-10">
              <TagBadge tag={item.badge} />
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            {item.isVeg && <VegBadge />}
            <h3 className="font-playfair text-base font-bold text-earth-dark leading-tight">
              {item.name}
            </h3>
          </div>
          <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-3 flex-1">
            {item.description}
          </p>
          {item.variants ? (
            <div className="space-y-2">
              {item.variants.map((v) => (
                <div
                  key={v.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-body">
                    {v.label} <span className="currency-symbol">Rs</span>{" "}
                    <span className="text-earth-dark font-medium">
                      {v.price}
                    </span>
                  </span>
                  <button
                    onClick={(e) => handleAdd(e, v.price, v.label)}
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
                onClick={(e) => handleAdd(e, displayPrice)}
                className="w-8 h-8 rounded-full bg-pink/10 text-pink hover:bg-pink hover:text-white transition-colors duration-200 flex items-center justify-center flex-shrink-0"
                aria-label={`Add ${item.name} to cart`}
              >
                <Plus size={16} />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Expanded modal */}
      <AnimatePresence>
        {expanded && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setExpanded(false)}
            />
            <motion.div
              className="fixed z-50 bottom-0 left-0 right-0 max-h-[85vh] rounded-t-2xl sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:max-h-[90vh] sm:rounded-2xl bg-white overflow-hidden flex flex-col"
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Close button */}
              <button
                onClick={() => setExpanded(false)}
                className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center hover:bg-black/60 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>

              {/* Large image */}
              <div className="relative aspect-[16/10] sm:aspect-[4/3] overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-yellow-50 flex-shrink-0">
                {" "}
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 512px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center opacity-30">
                      <span className="font-caveat text-5xl text-earth-dark/40">
                        Casa
                      </span>
                    </div>
                  </div>
                )}
                {item.badge && (
                  <div className="absolute top-4 left-4">
                    <TagBadge tag={item.badge} />
                  </div>
                )}
              </div>

              {/* Full info */}
              <div className="p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-2">
                  {item.isVeg && <VegBadge />}
                  <h3 className="font-playfair text-xl font-bold text-earth-dark">
                    {item.name}
                  </h3>
                </div>

                <p className="text-sm text-muted leading-relaxed mb-5">
                  {item.description}
                </p>

                {item.variants ? (
                  <div className="space-y-3">
                    {item.variants.map((v) => (
                      <div
                        key={v.label}
                        className="flex items-center justify-between bg-cream rounded-xl px-4 py-3"
                      >
                        <span className="text-sm text-body font-medium">
                          {v.label} <span className="currency-symbol">Rs</span>{" "}
                          <span className="text-earth-dark font-semibold">
                            {v.price}
                          </span>
                        </span>
                        <button
                          onClick={(e) => {
                            handleAdd(e, v.price, v.label);
                            setExpanded(false);
                          }}
                          className="px-4 py-2 bg-pink text-white text-sm font-semibold rounded-full hover:bg-pink-dark transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-between bg-cream rounded-xl px-4 py-3">
                    <span className="text-sm text-body">
                      <span className="currency-symbol">Rs</span>{" "}
                      <span className="text-earth-dark font-semibold text-lg">
                        {displayPrice}
                      </span>
                    </span>
                    <button
                      onClick={(e) => {
                        handleAdd(e, displayPrice);
                        setExpanded(false);
                      }}
                      className="px-6 py-2.5 bg-pink text-white text-sm font-semibold rounded-full hover:bg-pink-dark transition-colors"
                    >
                      Add to Order
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
