"use client";

import { useState, useEffect, useRef } from "react";
import { menuItems, type MenuCategory } from "@/data/menu";
import CategoryTabs from "@/components/menu/CategoryTabs";
import MenuItemCard from "@/components/menu/MenuItemCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

function MenuCardSkeleton() {
  return (
    <div
      style={{
        background: "#FFFEF9",
        borderRadius: "20px",
        border: "1px solid rgba(60,40,20,0.08)",
        boxShadow: "0 2px 16px rgba(60,40,20,0.07)",
        overflow: "hidden",
      }}
    >
      {/* Image skeleton */}
      <div
        className="w-full shrink-0 animate-pulse"
        style={{
          aspectRatio: "3/4",
          background:
            "linear-gradient(90deg, #f0e8d8 25%, #e8dcc8 50%, #f0e8d8 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }}
      />
      {/* Content skeleton */}
      <div style={{ padding: "16px 18px 18px" }}>
        <div
          className="animate-pulse"
          style={{
            height: "12px",
            background: "#f0e8d8",
            borderRadius: "6px",
            marginBottom: "8px",
            width: "90%",
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: "12px",
            background: "#f0e8d8",
            borderRadius: "6px",
            marginBottom: "16px",
            width: "70%",
          }}
        />
        <div
          className="animate-pulse"
          style={{
            height: "36px",
            background: "#f0e8d8",
            borderRadius: "10px",
            width: "100%",
          }}
        />
      </div>
    </div>
  );
}

export default function MenuSection() {
  const [activeCategory, setActiveCategory] =
    useState<MenuCategory>("starters");
  const [menuImages, setMenuImages] = useState<Record<string, string>>({});
  const [imagesReady, setImagesReady] = useState(false);
  const menuRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/menu-images")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, string> = {};
        (data.images || []).forEach((img: { slug: string; url: string }) => {
          map[img.slug] = img.url;
        });
        setMenuImages(map);
        setImagesReady(true);
      })
      .catch(() => {
        setImagesReady(true);
      });
  }, []);

  const handleCategorySelect = (cat: MenuCategory) => {
    setActiveCategory(cat);
    menuRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredItems = menuItems.filter(
    (item) => item.category === activeCategory,
  );

  return (
    <section ref={menuRef} id="menu" className="py-16 sm:py-20 bg-cream">
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="font-caveat text-pink text-xl">Explore</span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-earth-dark mt-1">
              Our Menu
            </h2>
          </div>
        </ScrollReveal>

        <div className="sticky top-20 z-30 bg-cream/95 backdrop-blur-sm py-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          <CategoryTabs
            active={activeCategory}
            onSelect={handleCategorySelect}
          />
        </div>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {!imagesReady
            ? filteredItems.map((item) => <MenuCardSkeleton key={item.id} />)
            : filteredItems.map((item, index) => (
                <ScrollReveal key={item.id} delay={index * 0.05}>
                  <MenuItemCard
                    item={item}
                    overrideImage={menuImages[item.slug]}
                  />
                </ScrollReveal>
              ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted">
            <p>No items in this category yet.</p>
          </div>
        )}
      </div>
    </section>
  );
}
