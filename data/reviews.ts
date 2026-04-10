export interface Review {
  id: string;
  name: string;
  location: string;
  source: "Google" | "TripAdvisor";
  rating: number;
  quote: string;
  avatar?: string;
}

export const reviews: Review[] = [
  {
    id: "r1",
    name: "James K.",
    location: "London, UK",
    source: "TripAdvisor",
    rating: 5,
    quote:
      "Authentic Mexican taste right in the heart of Kathmandu. The Al Pastor tacos were absolutely incredible — transported me straight to Mexico City.",
  },
  {
    id: "r2",
    name: "Aarav S.",
    location: "Kathmandu, Nepal",
    source: "Google",
    rating: 5,
    quote:
      "Best Mexican food in Nepal, hands down. The guacamole is fresh, the churros are addictive, and the vibe is always warm and welcoming.",
  },
  {
    id: "r3",
    name: "Mariana R.",
    location: "Guadalajara, México",
    source: "TripAdvisor",
    rating: 5,
    quote:
      "As a Mexican, I was skeptical. But Casa Mexicana genuinely nails it. The salsas, the tortillas — it feels like home. Incredible for Kathmandu.",
  },
];
