# Devshay Healthcare — B2B Pharmacy Website

A full-stack B2B pharmaceutical website with an admin panel. Built with **Next.js (JavaScript, App Router)**, **Neon Postgres + Prisma**, **Tailwind CSS**, **Cloudinary** (media) and **Gmail SMTP** (email).

Frontend and backend run on the **same Next.js server** (API routes under `/api`).

## Features

**Public site**
- Home — hero, about, product showcase (category circles + carousel), promo banners, testimonials, FAQs, CTA
- Products listing with search + category filter
- Product detail page (full medical info, price table, gallery, related products)
- Book now → opens WhatsApp prefilled with the product
- About page (fully admin-managed sections)
- Contact page (form emails you + saves the message)
- Transparent header that turns solid on scroll, floating WhatsApp button, scroll-to-top, footer

**Admin panel** (`/admin`)
- Hero sections, Promo banners, Testimonials, FAQs, CTA bands, About page, Site details
- Categories and Products (medicines) with rich medical fields + rich-text editor
- Cloudinary uploads for all images/videos

## Tech stack
| Concern | Choice |
|---|---|
| Framework | Next.js 14 (App Router, JavaScript) |
| Database | Neon Postgres via Prisma ORM |
| Styling | Tailwind CSS (brand `#34c0eb` + gray/white) |
| Media | Cloudinary |
| Email | Gmail SMTP (App Password) |
| Auth | JWT in an httpOnly cookie |

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** — values are in `.env` (already filled). See `.env.example` for the list of keys. Key ones:
   - `DATABASE_URL` — Neon pooled connection string
   - `CLOUDINARY_*` — media uploads
   - `SMTP_*` — Gmail SMTP with an App Password
   - `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`

3. **Create the database tables**
   ```bash
   npm run prisma:push
   ```

4. **Seed the admin + demo content**
   ```bash
   npm run seed
   ```
   This creates the admin login and sample categories, products, hero, testimonials, FAQs, CTA and About content.

5. **Run**
   ```bash
   npm run dev
   ```
   - Public site: http://localhost:3000
   - Admin panel: http://localhost:3000/admin
   - Default login: `admin@devrishi.com` / `Admin@12345` (from `.env`)

## Production
```bash
npm run build
npm run start
```

## Project structure
```
prisma/schema.prisma     # all DB models
prisma/seed.js           # admin + demo content
src/lib/                 # prisma, auth, cloudinary, mailer, data fetchers, helpers
src/app/api/             # API routes (auth, admin CRUD, uploads, contact)
src/app/(site)/          # public pages (home, products, about, contact)
src/app/admin/           # admin panel pages
src/components/site/     # public UI components
src/components/admin/    # admin UI components + RichTextEditor
```

## Notes
- The WhatsApp number used by the floating button and "Book now" comes from **Admin → Site Details**.
- Email delivery uses a Gmail **App Password** (not your normal password) — generate one at https://myaccount.google.com/apppasswords.
- If the database isn't reachable, public pages still render with empty/fallback content (they fail safe).
