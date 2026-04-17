"use client";
import { useState } from "react";
import { X, Star } from "lucide-react";

export default function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [form, setForm] = useState({ name: "", location: "", quote: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!rating) return setError("Please select a star rating.");
    if (!form.name.trim()) return setError("Please enter your name.");
    if (!form.location.trim()) return setError("Please enter your location.");
    if (!form.quote.trim()) return setError("Please write a review.");

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, rating }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star size={28} className="fill-yellow text-yellow" />
            </div>
            <p className="font-playfair text-xl font-bold text-earth-dark mb-2">
              Thank you!
            </p>
            <p className="text-muted text-sm">
              Your review is pending approval and will appear soon.
            </p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-teal text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="font-caveat text-pink text-lg">Casa Mexicana</p>
                <p className="font-playfair text-xl font-bold text-earth-dark">
                  Leave a review
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <X size={16} className="text-muted" />
              </button>
            </div>

            {/* Stars */}
            <div className="mb-4">
              <p className="text-xs text-muted mb-2">Overall rating</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={32}
                    className="cursor-pointer transition-colors"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(i)}
                    fill={(hover || rating) >= i ? "#F59E0B" : "none"}
                    stroke={(hover || rating) >= i ? "#F59E0B" : "#D1D5DB"}
                  />
                ))}
              </div>
            </div>

            {/* Review text */}
            <div className="mb-3">
              <p className="text-xs text-muted mb-1.5">Your review</p>
              <textarea
                rows={3}
                placeholder="What did you love about your visit?"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm resize-none focus:outline-none focus:border-teal transition-colors"
                value={form.quote}
                onChange={(e) => setForm({ ...form, quote: e.target.value })}
              />
            </div>

            {/* Name + Location */}
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div>
                <p className="text-xs text-muted mb-1.5">Name</p>
                <input
                  type="text"
                  placeholder="John D."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal transition-colors"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <p className="text-xs text-muted mb-1.5">Location</p>
                <input
                  type="text"
                  placeholder="London, UK"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-teal transition-colors"
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-xs text-red-500 mb-3 text-center">{error}</p>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-teal text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit review"}
            </button>

            <p className="text-center text-xs text-muted mt-3">
              Reviews are approved before going live
            </p>
          </>
        )}
      </div>
    </div>
  );
}
