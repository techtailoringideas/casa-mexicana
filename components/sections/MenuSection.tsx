"use client";

import { useState } from "react";
import { menuItems, type MenuCategory } from "@/data/menu";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function MenuSection() {
  const [activeCategory, setActiveCategory] =
    useState<MenuCategory>("starters");

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory,
  );

  return (
    <section id="menu" className="py-16 sm:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section header */}
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="font-caveat text-pink text-xl">Explore</span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-earth-dark mt-1">
              Our Menu
            </h2>
          </div>
        </ScrollReveal>

        {/* Sticky category tabs */}
        <div className="sticky top-20 z-30 bg-cream/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          <CategoryTabs active={activeCategory} onSelect={setActiveCategory} />
        </div>

        {/* Menu items grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredItems.map((item, index) => (
            <ScrollReveal key={item.id} delay={index * 0.05}>
              <MenuItemCard item={item} />
            </ScrollReveal>
          ))}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>No items in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
