# Casa Mexicana KTM — Production Website

Authentic Mexican cuisine in Kathmandu, Nepal. Mobile-first, conversion-optimized restaurant website built with Next.js 14+.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

| Component   | Technology                                          |
| ----------- | --------------------------------------------------- |
| Framework   | Next.js 14+ (App Router, Server Components)         |
| Language    | TypeScript (strict mode)                            |
| Styling     | Tailwind CSS v4 + CSS custom properties             |
| Animation   | Framer Motion (scroll reveals, micro-interactions)  |
| State       | Zustand (cart only)                                 |
| Forms       | React Hook Form + Zod validation                    |
| Maps        | Google Maps Embed (zero billing, iframe)            |
| Images      | next/image — WebP/AVIF, blur placeholder, lazy load |
| Fonts       | Playfair Display + DM Sans + Caveat                 |
| Deployment  | Vercel (edge, ISR, auto image CDN)                  |
| SEO         | Next.js Metadata API + JSON-LD schemas              |

## Project Structure

```
casa-mexicana/
├── app/
│   ├── layout.tsx            # Root: fonts, metadata, GA4, JSON-LD
│   ├── page.tsx              # Home: composes all 5 sections
│   ├── globals.css           # Tailwind + brand design system
│   ├── sitemap.ts            # Auto-generated sitemap
│   ├── menu/page.tsx         # Standalone /menu SEO page
│   └── api/
│       ├── reservation/route.ts  # Future reservation backend
│       └── order/route.ts        # Future order backend
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # Sticky, scroll-aware, mobile drawer
│   │   └── Footer.tsx        # Logo, address, phone, email, socials
│   ├── sections/
│   │   ├── Hero.tsx          # Full-viewport hero + 2 CTAs
│   │   ├── MenuSection.tsx   # Tabs + card grid
│   │   ├── Reviews.tsx       # 3 static review cards
│   │   └── LocationMap.tsx   # Google Maps + directions + contact
│   ├── menu/
│   │   ├── MenuItemCard.tsx  # Uniform card component (core)
│   │   └── CategoryTabs.tsx  # Sticky horizontal scroll tabs
│   ├── cart/
│   │   └── CartDrawer.tsx    # Bottom sheet / side panel + WhatsApp
│   ├── booking/
│   │   └── ReservationModal.tsx  # Form → WhatsApp reservation
│   └── ui/
│       ├── ScrollReveal.tsx  # Framer Motion scroll wrapper
│       ├── VegBadge.tsx      # Green veg indicator
│       └── TagBadge.tsx      # FAVORITE / CHEF'S PICK / NEW badge
├── data/
│   ├── menu.ts              # Single source of truth — all menu items
│   ├── reviews.ts           # 3 curated reviews
│   └── site.ts              # Restaurant info, hours, coordinates
├── store/
│   └── useCart.ts            # Zustand cart store
├── lib/
│   ├── whatsapp.ts          # WhatsApp message URL builders
│   ├── schema.ts            # JSON-LD schema generators
│   └── utils.ts             # cn(), formatPrice()
└── public/
    ├── robots.txt
    └── images/menu/          # Drop food photos here (slug-named .webp)
```

## How to Update Content

### Menu Items
Edit `data/menu.ts`. Add/remove items — all components auto-update.

### Restaurant Info
Edit `data/site.ts` — address, phone, hours, coordinates, social links.

### Reviews
Edit `data/reviews.ts` — 3 curated reviews with name, location, source.

### Images
Drop WebP images into `public/images/menu/` named by slug:
- `al-pastor-tacos.webp`
- `guacamole.webp`
- etc.

Then update the MenuItemCard component to use `next/image` instead of the placeholder gradient.

## UX Psychology Rules Applied

1. **Hero**: Full-viewport food photo as sensory trigger (Priming Effect). Zero fluff — only "View Menu" + "Book a Table".
2. **Menu prices**: Inline after description, never right-aligned columns (anti-price-scan). Currency symbol "Rs" at 0.7em/60% opacity (Pain of Paying reduction).
3. **FAVORITE / CHEF'S PICK badges**: Decoy Effect to simplify Paradox of Choice.
4. **Reviews**: 3 static cards — 1 international, 1 local, 1 Mexican (Authority Bias / Bandwagon Effect).
5. **Get Directions**: One-tap button eliminates copy-paste friction (30% conversion loss prevention).

## Mobile-First Specs

- Built for 375px width first, scaled up
- Min 44×44px tap targets
- CTAs in thumb zone (bottom 40% of viewport)
- Input font size ≥ 16px (prevents iOS auto-zoom)
- Cart: bottom sheet on mobile (85vh), side panel on desktop (420px)
- Reservation: full-screen takeover on mobile
- Horizontal scroll tabs with snap
- Zero hover-dependent interactions

## Deployment to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo at vercel.com for auto-deploy
```

### Environment Setup
1. Replace `G-XXXXXXX` in `app/layout.tsx` with your GA4 Measurement ID
2. Update the Google Maps embed URL in `data/site.ts` with your actual embed code
3. Add your domain to `next.config.ts` images.domains if using external image sources

## Scalability

| Scale Path       | What Changes              | What Stays                    |
| ---------------- | ------------------------- | ----------------------------- |
| CMS Migration    | Data-fetching layer only  | All components stay identical |
| Multi-Location   | Add to locations[]        | LocationMap maps over array   |
| Online Payments  | Swap WhatsApp CTA         | Cart data model unchanged     |
| Multi-Language   | Add name_es fields        | Component structure unchanged |
| Promotions       | Flip active: true in site | Banner component ready        |

## License

Private — Casa Mexicana Kathmandu
