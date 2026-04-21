// ═══════════════════════════════════════════════════════════
// MENU DATA — Single source of truth
// Edit this file to add/remove items. Components auto-update.
// ═══════════════════════════════════════════════════════════

export type MenuCategory =
  | "starters"
  | "soups-salads"
  | "tacos"
  | "burritos"
  | "special-plates"
  | "drinks"
  | "desserts";

export interface MenuVariant {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: MenuCategory;
  price?: number; // single price
  variants?: MenuVariant[]; // or multiple variants
  isVeg: boolean;
  badge?: "FAVORITE" | "CHEF'S PICK" | "NEW";
  addOns?: { name: string; price: number }[];
  image?: string; // slug → /images/menu/{slug}.webp
}

export const categories: { id: MenuCategory; label: string }[] = [
  { id: "starters", label: "Starters" },
  { id: "soups-salads", label: "Soups & Salads" },
  { id: "tacos", label: "Tacos" },
  { id: "burritos", label: "Burritos" },
  { id: "special-plates", label: "Special Plates" },
  { id: "drinks", label: "Drinks" },
  { id: "desserts", label: "Desserts" },
];

export const menuItems: MenuItem[] = [
  // ─── STARTERS ───
  {
    id: "fiesta-platter",
    slug: "fiesta-platter",
    name: "Fiesta Platter",
    description:
      "A platter with paneer in red salsa, guacamole, refried beans. Served with corn chips.",
    category: "starters",
    price: 1160,
    isVeg: true,
    badge: "FAVORITE",
    image: "/images/Fiesta-Platter.avif",
  },
  {
    id: "nachos-plain",
    slug: "nachos-plain",
    name: "Real Nachos",
    description:
      "Corn chips, cheese sauce, pico de Gallo and beans. Served with jalapeño slices and guacamole.",
    category: "starters",
    variants: [
      { label: "Plain", price: 880 },
      { label: "Meat", price: 1150 },
    ],
    isVeg: false,
    image: "/images/nachos.avif",
  },
  {
    id: "chilakiles",
    slug: "chilakiles",
    name: "Chilakiles",
    description:
      "Corn chips soaked in red salsa, cheese, sour cream and refried beans. Add one egg for only Rs 35.",
    category: "starters",
    price: 585,
    isVeg: true,
    image: "/images/chilakiles.avif",
  },
  {
    id: "queso",
    slug: "queso",
    name: "Queso",
    description:
      "Melted cheese served with your choice of pork chorizo, pork Al Pastor or Mushroom.",
    category: "starters",
    price: 650,
    isVeg: false,
    image: "/images/Queso.avif",
  },
  {
    id: "guacamole",
    slug: "guacamole",
    name: "Guacamole",
    description: "Our famous guacamole dip served with corn chips.",
    category: "starters",
    price: 890,
    isVeg: true,
    badge: "FAVORITE",
  },
  {
    id: "sopes",
    slug: "sopes",
    name: "Sopes",
    description:
      "Corn casseroles with beans, your choice of filling, topped with cream, cheese and veggies.",
    category: "starters",
    price: 830,
    isVeg: false,
    image: "/images/Sopes.avif",
  },
  {
    id: "chipotle-papas",
    slug: "chipotle-papas",
    name: "Chipotle Papas",
    description:
      "Our famous garlic salsa potatoes with chipotle mayo. The special ones go with cheddar cheese and bacon.",
    category: "starters",
    variants: [
      { label: "Plain", price: 250 },
      { label: "Special", price: 480 },
    ],
    isVeg: false,
  },
  {
    id: "chips-n-salsa",
    slug: "chips-n-salsa",
    name: "Chips 'N Salsa",
    description:
      "The perfect combination of our traditional salsa, tajin and corn chips.",
    category: "starters",
    price: 290,
    isVeg: true,
  },

  // ─── SOUPS & SALADS ───
  {
    id: "tortilla-soup",
    slug: "tortilla-soup",
    name: "Tortilla Soup",
    description:
      "Our traditional Mexican soup with fried tortilla chips, mexican cheese and sour cream.",
    category: "soups-salads",
    variants: [
      { label: "Plain", price: 480 },
      { label: "Chicken", price: 580 },
    ],
    isVeg: false,
    badge: "FAVORITE",
    image: "/images/Tortilla-Soup.avif",
  },
  {
    id: "red-rice",
    slug: "red-rice",
    name: "Red Rice",
    description:
      "Traditional Mexican rice cooked with tomato sauce and spices. Add one egg for only Rs 35.",
    category: "soups-salads",
    variants: [
      { label: "Plain", price: 275 },
      { label: "Meat", price: 480 },
    ],
    isVeg: false,
  },
  {
    id: "avocado-salad",
    slug: "avocado-salad",
    name: "Avocado Salad",
    description:
      "Lettuce, onion, olives, tomatoes, cucumbers, avocado, mexican cheese, corn stripes and our vinaigrette.",
    category: "soups-salads",
    variants: [
      { label: "Veg", price: 725 },
      { label: "Meat", price: 860 },
    ],
    isVeg: false,
    image: "/images/Avocado Salad.avif",
  },

  // ─── TACOS ───
  {
    id: "tacos-pork",
    slug: "tacos-pork",
    name: "Pork Tacos",
    description:
      "Four tortillas (corn or flour), refried beans, pork in red salsa with a side of Mexican red rice and garlic potatoes.",
    category: "tacos",
    price: 670,
    isVeg: false,
  },
  {
    id: "tacos-chicken",
    slug: "tacos-chicken",
    name: "Chicken Tacos",
    description:
      "Four tortillas with Suprema (breaded chicken with chipotle dressing) or Tinga (chicken, onions, tomatoes and chillies).",
    category: "tacos",
    price: 670,
    isVeg: false,
    badge: "FAVORITE",
    image: "/images/Chicken Tacos.avif",
  },
  {
    id: "tacos-rajas",
    slug: "tacos-rajas",
    name: "Rajas Tacos",
    description:
      "Four tortillas with paneer, capsicum and onions cooked in a creamy sauce.",
    category: "tacos",
    price: 670,
    isVeg: true,
  },
  {
    id: "tacos-buff",
    slug: "tacos-buff",
    name: "Buff Tacos",
    description:
      "Four tortillas with buff tenderloin in a salsa of Mexican pasilla chilly.",
    category: "tacos",
    price: 670,
    isVeg: false,
  },
  {
    id: "tacos-all-in-one",
    slug: "tacos-all-in-one",
    name: "All-in-One Tacos",
    description:
      "Four tortillas with a mix of rajas paneer, mushroom and Mexican potatoes.",
    category: "tacos",
    price: 670,
    isVeg: true,
  },

  // ─── BURRITOS ───
  {
    id: "burrito-pork",
    slug: "burrito-pork",
    name: "Pork Burrito",
    description:
      "A big flour tortilla filled with refried beans, cheese and pork in red salsa.",
    category: "burritos",
    price: 750,
    isVeg: false,
  },
  {
    id: "burrito-chicken",
    slug: "burrito-chicken",
    name: "Chicken Burrito",
    description:
      "A big flour tortilla filled with refried beans, cheese and chicken.",
    category: "burritos",
    price: 750,
    isVeg: false,
  },
  {
    id: "burrito-rajas",
    slug: "burrito-rajas",
    name: "Rajas Burrito",
    description:
      "A big flour tortilla filled with refried beans, cheese, paneer with capsicum and onions in creamy sauce.",
    category: "burritos",
    price: 750,
    isVeg: true,
  },
  {
    id: "burrito-buff",
    slug: "burrito-buff",
    name: "Buff Burrito",
    description:
      "A big flour tortilla filled with refried beans, cheese and buff in salsa.",
    category: "burritos",
    price: 750,
    isVeg: false,
    image: "/images/burritobuff.jpeg",
  },
  {
    id: "burrito-all-in-one",
    slug: "burrito-all-in-one",
    name: "All-in-One Burrito",
    description:
      "A big flour tortilla filled with refried beans, cheese, rajas paneer, mushroom and Mexican potatoes.",
    category: "burritos",
    price: 750,
    isVeg: true,
    badge: "CHEF'S PICK",
  },

  // ─── SPECIAL PLATES ───
  {
    id: "enchiladas",
    slug: "enchiladas",
    name: "Enchiladas",
    description:
      "Four tortillas filled with chicken or paneer rajas, dip in red salsa, topped with cream and cheese. Served with beans or red rice.",
    category: "special-plates",
    price: 830,
    isVeg: false,
    image: "/images/Enchiladas.avif",
  },
  {
    id: "salsa-tacos",
    slug: "salsa-tacos",
    name: "Salsa Tacos",
    description:
      "Folded fried corn tortillas filled with rajas paneer or chicken, dip in Guajillo chilly salsa, cream and Mexican cheese.",
    category: "special-plates",
    price: 830,
    isVeg: false,
    image: "/images/Salsa-Tacos.avif",
  },
  {
    id: "american-quesadilla",
    slug: "american-quesadilla",
    name: "American Quesadilla",
    description:
      "Our burrito roti slightly fried with your choice of filling, double cheese and a side of our guacamole.",
    category: "special-plates",
    price: 880,
    isVeg: false,
    image: "/images/American Quesadilla.avif",
  },
  {
    id: "suprema-plate",
    slug: "suprema-plate",
    name: "Suprema Plate",
    description:
      "Seasoned breaded chicken cutlets with chipotle dressing, Mexican red rice and salad on the side.",
    category: "special-plates",
    price: 950,
    isVeg: false,
    badge: "CHEF'S PICK",
    image: "/images/Suprema-Plate.avif",
  },
  {
    id: "carnitas-tacos",
    slug: "carnitas-tacos",
    name: "Carnitas Tacos",
    description:
      "Corn or flour tortillas filled with slow cooked pork, mozzarella cheese and guacamole. Served with red rice or Mexican potatoes.",
    category: "special-plates",
    price: 880,
    isVeg: false,
    image: "/images/Carnitas Tacos.avif",
  },
  {
    id: "al-pastor-tacos",
    slug: "al-pastor-tacos",
    name: "Al Pastor Tacos",
    description:
      "Marinated pork cooked in Mexican chillies and spices, mozzarella cheese and guacamole. Served with red rice and pineapple-onion achar.",
    category: "special-plates",
    price: 880,
    isVeg: false,
    badge: "FAVORITE",
    image: "/images/Al Pastor Tacos.avif",
  },
  {
    id: "shrimp-tacos",
    slug: "shrimp-tacos",
    name: "Shrimp Tacos",
    description:
      "Buttery shrimp, onions, bell pepper, melted cheese and chipotle mayonnaise folded in fresh corn tortillas.",
    category: "special-plates",
    price: 950,
    isVeg: false,
    image: "/images/Shrimp Tacos.avif",
  },

  // ─── DRINKS ───
  {
    id: "pepino-limon",
    slug: "pepino-limon",
    name: "Pepino Limón",
    description: "Refreshing cucumber lemon drink.",
    category: "drinks",
    price: 330,
    isVeg: true,
    image: "/images/pepino lemon.avif",
  },
  {
    id: "jamaica",
    slug: "jamaica",
    name: "Jamaica",
    description: "Traditional hibiscus flower drink.",
    category: "drinks",
    price: 330,
    isVeg: true,
    badge: "FAVORITE",
    image: "/images/jamaica.avif",
  },
  {
    id: "tamarindo",
    slug: "tamarindo",
    name: "Tamarindo",
    description: "Sweet and tangy tamarind drink.",
    category: "drinks",
    price: 330,
    isVeg: true,
    image: "/images/tamarindo.avif",
  },
  {
    id: "mango",
    slug: "mango",
    name: "Mango",
    description: "Fresh mango drink.",
    category: "drinks",
    price: 330,
    isVeg: true,
  },
  {
    id: "horchata",
    slug: "horchata",
    name: "Horchata",
    description: "Traditional rice, milk and cinnamon drink.",
    category: "drinks",
    price: 330,
    isVeg: true,
    badge: "CHEF'S PICK",
  },
  {
    id: "horchata-coco",
    slug: "horchata-coco",
    name: "Horchata Coco",
    description: "Rice, milk, coconut and cinnamon drink.",
    category: "drinks",
    price: 330,
    isVeg: true,
    image: "/images/horchata.avif",
  },
  {
    id: "lemonade",
    slug: "lemonade",
    name: "Lemonade",
    description: "Mexican-style lemonade.",
    category: "drinks",
    price: 330,
    isVeg: true,
  },
  {
    id: "pina-fresa",
    slug: "pina-fresa",
    name: "Piña-Fresa",
    description: "Pineapple and strawberry drink.",
    category: "drinks",
    price: 330,
    isVeg: true,
    image: "/images/pina-fresa.avif",
  },
  {
    id: "soft-drink",
    slug: "soft-drink",
    name: "Soft Drinks",
    description: "Coke, Sprite, Fanta or Soda.",
    category: "drinks",
    price: 130,
    isVeg: true,
  },

  // ─── DESSERTS ───
  {
    id: "carlota",
    slug: "carlota",
    name: "Carlota",
    description:
      "Multiple layers of vanilla cookies, covered in a sweet lime creamy sauce.",
    category: "desserts",
    price: 300,
    isVeg: true,
  },
  {
    id: "tres-leches",
    slug: "tres-leches",
    name: "Tres Leches",
    description:
      "Traditional Mexican vanilla cake soaked in a three-milk mix, topped with whipping cream.",
    category: "desserts",
    variants: [
      { label: "Individual", price: 300 },
      { label: "Sharing", price: 550 },
    ],
    isVeg: true,
    badge: "FAVORITE",
    image: "/images/tres-leches.jpeg",
  },
  {
    id: "churros",
    slug: "churros",
    name: "Churros",
    description:
      "Cinnamon and sugar topped fried pastry dough with Cajeta (Caramel).",
    category: "desserts",
    price: 200,
    isVeg: true,
    badge: "FAVORITE",
    image: "/images/Churros.avif",
  },
];

// Taco & Burrito add-ons
export const addOns = [
  { name: "Guacamole", price: 180 },
  { name: "Cheese", price: 110 },
  { name: "Chorizo", price: 120 },
  { name: "Bacon", price: 110 },
];
