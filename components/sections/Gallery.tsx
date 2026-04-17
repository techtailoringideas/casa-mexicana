"use client";

import { useState, useEffect } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Image from "next/image";

interface GalleryImage {
  name: string;
  url: string;
  created_at: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/gallery");
        const data = await res.json();
        setImages(data.images || []);
      } catch {
        console.error("Failed to fetch gallery");
      }
      setLoading(false);
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-[#FFFEF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[#7a5c48]">Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-16 sm:py-20 relative bg-[#FFFEF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="font-caveat text-pink text-xl">Our Moments</span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#1a0d05] mt-1">
              Gallery
            </h2>
          </div>
        </ScrollReveal>
      </div>

      {/* ── HORIZONTAL FILM STRIP CONTAINER ── */}
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-8 px-4 sm:px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Empty div to create padding at the start of the scroll */}
        <div className="shrink-0 w-1 sm:w-4" />

        {images.map((image, i) => (
          <ScrollReveal
            key={image.name}
            delay={i * 0.05}
            className="shrink-0 snap-center"
          >
            <div className="relative w-[75vw] sm:w-[320px] md:w-[380px] aspect-[4/5] sm:aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-[rgba(60,40,20,0.08)] shadow-[0_4px_20px_rgba(60,40,20,0.04)]">
              <Image
                src={image.url}
                alt={`Casa Mexicana gallery ${i + 1}`}
                fill
                sizes="(max-width: 768px) 75vw, (max-width: 1024px) 320px, 380px"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-[#2A1A0A]/10 transition-colors duration-300" />
            </div>
          </ScrollReveal>
        ))}

        {/* Empty div to create padding at the end of the scroll */}
        <div className="shrink-0 w-4 sm:w-10" />
      </div>
    </section>
  );
}
