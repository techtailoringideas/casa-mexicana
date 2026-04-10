import { siteConfig } from "@/data/site";

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: siteConfig.name,
    description: `${siteConfig.name} — ${siteConfig.tagline}. Authentic Mexican cuisine in Kathmandu, Nepal since ${siteConfig.since}.`,
    url: "https://casamexicana.com.np",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Shree Laxmi Marg, Gairidhara",
      addressLocality: "Kathmandu",
      postalCode: "44600",
      addressCountry: "NP",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.coordinates.lat,
      longitude: siteConfig.coordinates.lng,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "11:00",
      closes: "21:00",
    },
    servesCuisine: "Mexican",
    priceRange: "$$",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: siteConfig.tripAdvisorRating,
      bestRating: 5,
      ratingCount: 200,
    },
    image: "https://casamexicana.com.np/images/og-image.jpg",
    sameAs: [siteConfig.socials.facebook, siteConfig.socials.instagram],
  };
}

export function getMenuSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: `${siteConfig.name} Menu`,
    description: "Full menu for Casa Mexicana Kathmandu",
    hasMenuSection: [
      { "@type": "MenuSection", name: "Starters" },
      { "@type": "MenuSection", name: "Soups & Salads" },
      { "@type": "MenuSection", name: "Tacos" },
      { "@type": "MenuSection", name: "Burritos" },
      { "@type": "MenuSection", name: "Special Plates" },
      { "@type": "MenuSection", name: "Drinks" },
      { "@type": "MenuSection", name: "Desserts" },
    ],
  };
}
