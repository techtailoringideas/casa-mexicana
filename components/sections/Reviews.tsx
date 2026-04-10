"use client";

import { Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import ScrollReveal from "@/components/ui/ScrollReveal";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < rating ? "fill-yellow text-yellow" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="reviews" className="py-16 sm:py-20 bg-earth-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="font-caveat text-pink text-xl">What People Say</span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1">
              Reviews
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {reviews.map((review, i) => (
            <ScrollReveal key={review.id} delay={i * 0.15}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col h-full">
                {/* Stars */}
                <StarRating rating={review.rating} />

                {/* Quote */}
                <p className="text-white/80 text-sm leading-relaxed mt-4 flex-1 italic">
                  &ldquo;{review.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="mt-5 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">
                        {review.name}
                      </p>
                      <p className="text-white/50 text-xs">{review.location}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        review.source === "Google"
                          ? "bg-blue-500/20 text-blue-300"
                          : "bg-green-500/20 text-green-300"
                      }`}
                    >
                      {review.source}
                    </span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
