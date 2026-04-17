"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";
import ReviewModal from "@/components/ui/ReviewModal";

interface Review {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
  created_at: string;
  featured: boolean; // Added featured flag
}

// Helper function to rotate featured reviews
function getRotatingFeatured(featured: Review[], count: number): Review[] {
  if (featured.length <= count) return featured;
  const shuffled = [...featured].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < rating ? "#F59E0B" : "none"}
          stroke={i < rating ? "#F59E0B" : "#6B7280"}
        />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [displayedTop, setDisplayedTop] = useState<Review[]>([]); // New state for rotating
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((data) => {
        const all = data.reviews || [];
        setReviews(all);

        const featured = all.filter((r: Review) => r.featured);

        // If enough featured, rotate from them; otherwise fall back to latest
        if (featured.length >= 3) {
          setDisplayedTop(getRotatingFeatured(featured, 3));
        } else {
          setDisplayedTop(all.slice(0, 3));
        }

        setLoading(false);
      });
  }, []);

  // Clean React pattern: determine which reviews to show BEFORE the return statement
  const displayedReviews = showAll ? reviews : displayedTop;

  return (
    <section
      id="reviews"
      className="py-16 sm:py-20"
      style={{
        background:
          "linear-gradient(135deg, #0D5C58 0%, #062E2C 50%, #0D5C58 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <ScrollReveal>
          <div className="text-center mb-12">
            <span className="font-caveat text-yellow text-xl">
              What People Say
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-white mt-1">
              Reviews
            </h2>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="text-center text-white/50 py-10">
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-white/50 py-10">
            No reviews yet. Be the first!
          </div>
        ) : (
          <>
            {/* Grid using the new displayedReviews variable */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {displayedReviews.map((review, i) => (
                <ScrollReveal key={review.id} delay={i * 0.15}>
                  <div className="bg-white/5 backdrop-blur-sm border border-teal/20 rounded-2xl p-6 flex flex-col h-full hover:border-teal/40 transition-colors duration-300">
                    <StarRating rating={review.rating} />
                    <p className="text-white/80 text-sm leading-relaxed mt-4 flex-1 italic">
                      &ldquo;{review.quote}&rdquo;
                    </p>
                    <div className="mt-5 pt-4 border-t border-white/10">
                      <p className="text-white font-medium text-sm">
                        {review.name}
                      </p>
                      <p className="text-white/50 text-xs">{review.location}</p>
                      <p className="text-white/30 text-xs mt-1">
                        {new Date(
                          new Date(review.created_at).getTime() +
                            (5 * 60 + 45) * 60000,
                        ).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Show All / Show Less Toggle Button */}
            {reviews.length > 3 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="text-white/60 hover:text-white text-sm underline underline-offset-4 transition-colors"
                >
                  {showAll
                    ? "Show Less"
                    : `See All Reviews (${reviews.length - 3} more)`}
                </button>
              </div>
            )}
          </>
        )}

        {/* Write a Review Button */}
        <div className="text-center mt-12">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-7 py-3 bg-[#ff009d] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-sm shadow-lg"
          >
            <Star size={16} fill="white" stroke="white" />
            Leave a Review
          </button>
        </div>

        {/* The Modal */}
        {showModal && <ReviewModal onClose={() => setShowModal(false)} />}
      </div>
    </section>
  );
}
