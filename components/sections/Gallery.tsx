"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

interface GalleryImage {
  name: string;
  url: string;
  created_at: string;
}

export default function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

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

  const displayImages = showAll ? images : images.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted">Loading gallery...</p>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return null;
  }

  return (
    <section
      id="gallery"
      className="py-16 sm:py-20 relative"
      style={{
        background:
          "linear-gradient(135deg, #1C1C1C 0%, #0F0F0F 50%, #1C1C1C 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-10">
            <span className="font-caveat text-pink text-xl">Our Moments</span>
            {/* Notice I changed text-earth-dark to text-white here so it's visible! */}
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1">
              Gallery
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {displayImages.map((image, i) => (
            <ScrollReveal key={image.name} delay={i * 0.05}>
              <div className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer">
                <img
                  src={image.url}
                  alt={`Casa Mexicana gallery ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              </div>
            </ScrollReveal>
          ))}
        </div>

        {images.length > 6 && !showAll && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-earth-dark font-semibold rounded-full shadow-sm hover:bg-pink/5 hover:text-pink transition-colors text-sm border border-gray-200"
            >
              <Camera size={18} />
              Show More ({images.length - 6} more)
            </button>
          </div>
        )}

        {showAll && images.length > 6 && (
          <div className="text-center mt-8">
            <button
              onClick={() => setShowAll(false)}
              className="text-sm text-muted hover:text-pink transition-colors"
            >
              Show Less
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
