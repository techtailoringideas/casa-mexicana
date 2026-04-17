"use client";

import { useRef, useEffect } from "react";
import { categories, type MenuCategory } from "@/data/menu";

interface CategoryTabsProps {
  active: MenuCategory;
  onSelect: (id: MenuCategory) => void;
}

export default function CategoryTabs({ active, onSelect }: CategoryTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  // Auto-scroll active tab into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const button = activeRef.current;
      const scrollLeft =
        button.offsetLeft - container.offsetWidth / 2 + button.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [active]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide snap-x pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:justify-center sm:flex-wrap"
    >
      {categories.map((cat) => (
        <button
          key={cat.id}
          ref={cat.id === active ? activeRef : null}
          onClick={() => onSelect(cat.id)}
          className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 shrink-0 ${
            cat.id === active
              ? "bg-pink text-white shadow-md shadow-pink/20"
              : "bg-white text-body hover:bg-pink/10 hover:text-pink"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
