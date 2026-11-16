# Sukriti Chikan - Website & Admin Panel Plan

## Overview
E-commerce website for a Lucknowi Chikankari brand with an AI-powered admin panel.
The owner uploads photos, AI generates all product details, owner only sets the price.

## Architecture

```
Owner's Phone (Admin Page)
    |
    v  uploads photos
Supabase Storage (free: 1GB)
    |
    v
Gemini 2.0 Flash (free: 1500 req/day)
    |  analyzes photo -> generates name, description, category, fabric, work type, tags
    v
Supabase DB (PostgreSQL, free: 500MB)
    |
    v
Next.js Storefront (Vercel, free)
    |
    v
Customer clicks "Order on WhatsApp" -> pre-filled message
```

## Tech Stack & Cost

| Component        | Service              | Cost          |
|-----------------|----------------------|---------------|
| Frontend + Admin | Next.js on Vercel    | Free          |
| Database         | Supabase (free tier) | Free          |
| Image Storage    | Supabase Storage     | Free (1GB)    |
| AI Descriptions  | Gemini 2.0 Flash     | Free (1500/day)|
| Domain           | Vercel subdomain     | Free          |
| Payments         | WhatsApp orders      | Free          |
| **Total**        |                      | **Rs 0/month**|

## Admin Panel Flow

### Login
- Simple password-based auth
- Password stored in environment variable
- Session stored in browser sessionStorage

### Add Product (3-tap flow)
1. Owner opens /admin -> taps "+ Add Product"
2. Selects/takes photos from phone
3. AI auto-fills:
   - Product name (e.g., "Ivory Jaali Work Cotton Kurti")
   - Description (2-3 sentences about craftsmanship)
   - Category (kurti/suit/saree/dupatta/fabric/men/kids/accessories)
   - Fabric type (Cotton, Georgette, Chiffon, etc.)
   - Work type (Shadow Work, Jaali, Tepchi, Murri, etc.)
   - Search tags
4. Owner reviews AI-generated details (can edit if needed)
5. Owner sets PRICE (only required manual input)
6. Taps "Publish" -> product goes live on storefront

### Product Management
- Dashboard shows all products with thumbnails
- Toggle Live/Draft status per product
- Delete products
- Product count displayed

## Storefront Features
- Mobile-first responsive design
- Category filtering (All, Kurtis, Suits, Sarees, Dupattas, Fabric, Men)
- Product detail page with image gallery
- "Order on WhatsApp" button (pre-filled message with product name + price)
- Sticky navbar with hamburger menu on mobile

## File Structure

```
sukriti-chikan/
├── scripts/
│   ├── step1-setup.sh          # Install deps, create .env.local
│   ├── step2-supabase-db.sh    # Prints SQL for Supabase setup
│   ├── step3-start.sh          # Start dev server
│   └── supabase-setup.sql      # Database schema
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Storefront home
│   │   ├── globals.css         # Tailwind + base styles
│   │   ├── product/[id]/
│   │   │   └── page.tsx        # Product detail page
│   │   ├── admin/
│   │   │   ├── page.tsx        # Admin dashboard
│   │   │   ├── add/page.tsx    # Add product (AI-powered)
│   │   │   └── login/page.tsx  # Admin login
│   │   └── api/
│   │       ├── products/route.ts   # CRUD for products
│   │       ├── upload/route.ts     # Image upload to Supabase
│   │       └── ai-generate/route.ts # Gemini Vision AI
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   └── gemini.ts           # Gemini AI integration
│   └── components/
│       ├── Navbar.tsx           # Store navigation
│       ├── ProductCard.tsx      # Product grid card
│       └── WhatsAppButton.tsx   # WhatsApp order CTA
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── .env.local.example
├── .gitignore
└── PLAN.md                     # This file
```

## Setup Steps
1. Run `bash scripts/step1-setup.sh` (install deps)
2. Create Supabase project (free) -> copy URL + keys into .env.local
3. Get Gemini API key (free) -> add to .env.local
4. Set admin password + WhatsApp number in .env.local
5. Run `bash scripts/step2-supabase-db.sh` -> paste SQL in Supabase
6. Run `bash scripts/step3-start.sh` -> site runs at localhost:3000
7. Deploy: `npx vercel` -> get free sukriti-chikan.vercel.app URL

## Future Enhancements (when needed)
- Custom domain (~Rs 500/year)
- Razorpay/UPI payment integration
- Instagram Shop sync
- Size/color variants
- Inventory tracking
- Order management dashboard
- SEO optimization (SSR product pages)
