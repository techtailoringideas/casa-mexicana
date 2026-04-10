export const siteConfig = {
  name: "Casa Mexicana",
  tagline: "This is how México feels",
  since: 2017,
  address: "Shree Laxmi Marg, Gairidhara, Kathmandu 44600, Nepal",
  coordinates: { lat: 27.7172, lng: 85.324 },
  phone: "+977 984-0542082",
  phoneDisplay: "984-054-2082",
  email: "casamexicanakathmandu@gmail.com",
  hours: "Sun–Sat, 11:00 AM – 9:00 PM",
  hoursShort: "11 AM – 9 PM Daily",
  googleMapsUrl: "https://maps.app.goo.gl/NaPq74g7NJY1S5uPA",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3531.982817189409!2d85.3241409!3d27.7178168!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1911d1e4021f%3A0xfb8746a3d4a55aae!2sCasa%20Mexicana!5e0!3m2!1sen!2snp!4v1775712298030!5m2!1sen!2snp",
  whatsapp: "9779840542082",
  socials: {
    facebook: "https://facebook.com/casamexicanakathmandu",
    instagram: "https://instagram.com/casa.mexicana.ktm",
    tripAdvisor: "#",
  },
  tripAdvisorRating: 4.7,
  // Promotions banner — flip to true when running a promo
  promotion: {
    active: false,
    text: "🌮 Taco Thursday — 20% off all tacos!",
  },
} as const;
