# 888 Lock & Key — San Jose + Bay Area Implementation Plan

Client package: `../888LockKey_Full_Site_Package/` (source of truth for structure, content, linking, SEO).
Existing project: this folder (`web/`) — Next.js 16 + Payload CMS 3 (source of truth for architecture and functionality).
Progress tracker: `tracker.md` (kept in sync with this plan).
Checkpoint before any change: git tag `checkpoint-pre-bayarea-2026-09-22`.

---

## Phase 0 — Discovery & audit (DONE 2026-09-22)

### Existing project

| Area | Finding |
|---|---|
| Framework | Next.js 16.3.4 (App Router, React 19), Payload CMS 3.88 |
| Package manager | npm (`package-lock.json`) |
| Database | SQLite file locally/cPanel (`@payloadcms/db-sqlite`), Postgres/Supabase on Vercel (`@payloadcms/db-postgres`) — chosen by `DATABASE_URI`; separate migration folders `src/migrations` (sqlite) and `src/migrations-pg` |
| Uploads | local `media/` or Vercel Blob (`BLOB_READ_WRITE_TOKEN`) |
| Entry points | `src/app/(frontend)/layout.tsx` (site), `src/app/(payload)/` (admin + REST), `app.js` (cPanel/Passenger) |
| Routes (frontend) | `/`, `/services`, `/services/[slug]`, `/services/[slug]/[city]` (combo pages), `/locations`, `/locations/[slug]`, `/about`, `/pricing`, `/reviews`, `/faq`, `/contact`, `/book`, `/thank-you`, `/[slug]` (CMS pages: privacy, terms), `/sitemap.xml`, `/robots.txt`, `/api/enquiry` |
| Content model | Collections: `services`, `locations`, `pages`, `faqs`, `reviews`, `enquiries`, `media`, `users`. Globals: `site-settings`, `home-page`, `page-copy`, `combo-template`, `navigation`. Drafts/versions on services, locations, pages. |
| Reusable components | `Header` (desktop nav + mobile drawer), `Footer`, `StickyCall` (mobile call button), `Hero` / `PageHero` (with breadcrumbs), `blocks.tsx` (`SectionHead`, `ServiceCard`, `LocationCard`, `CtaBanner`, `CallCard`, `PricingTable`, `ReviewCard`, `ReviewMarquee`, `Prose`, `mediaUrl`), `FaqList`, `FaqExplorer`, `Icon`, `ProgressBar` |
| SEO | `generateMetadata` on every page, canonicals via `absolute()`, JSON-LD builders in `src/lib/schema.tsx` (Locksmith/LocalBusiness, Service, FAQPage, BreadcrumbList, Review), `sitemap.ts`, `robots.ts`, `seo` field group (title, description, image, noindex) on collections |
| Forms / APIs | Booking form → `POST /api/enquiry` (Zod validation, rate limit, honeypot) → `enquiries` collection → email alerts (Nodemailer/SMTP) → `/thank-you` |
| Integrations | SMTP email, Vercel Blob, Supabase, on-demand revalidation hooks (`src/lib/revalidate.ts`) |
| Env | `PAYLOAD_SECRET`, `DATABASE_URI`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_BASE_PATH` (cPanel sub-path), SMTP_*, `NOTIFY_EMAIL`, `SEED_ADMIN_*`, `BLOB_READ_WRITE_TOKEN` |
| Deployment | Vercel (`vercel-build`), cPanel (`scripts/cpanel-deploy.sh`, `app.js`), docs in `DEPLOY-VERCEL.md`, `DEPLOY-CPANEL.md` |
| Tests | `npm test` (template, media-url, rate-limit, enquiry-schema, base-path, email) — all passing at baseline; `tsc` clean; `next build` OK |
| Styling | single `src/styles/site.css` (3,150 lines), CSS variables, full-bleed `.wrap` |

**Outdated content in the existing project (to be replaced):**
- Positioning "Across California, Arizona & New York" (SiteSettings default, seed, homepage, about page, PageCopy).
- 6 seeded locations with invented storefront addresses: San Jose, San Francisco, Los Angeles, Phoenix, Scottsdale, New York City.
- 6 seeded services (Car Lockout, Residential Lockout, House Rekey, Car Key & Fob Replacement, Smart Lock Installation, Commercial & Access Control) with invented starting prices.
- Fabricated business data as defaults/seed: phone `(408) 555-0888`, licence `BSIS #LCO-000000`, rating `4.9/5`, `214` reviews, `24 MIN` arrival, `24/7` hours, 10 invented reviews.
- "24/7" hard-coded in layout title template, Footer ("24/7 DISPATCH LINE"), contact/faq/service pages, ComboTemplate defaults.
- Combo pages (`/services/[slug]/[city]`) generate a page for every service × city — not part of the client's architecture and would be thin content at 14 × 24.

### Client package inventory

`888LockKey_Full_Site_Package/` — **40 HTML files** + 2 JSON data files + README. All CSS/JS is inline; no separate assets.

| File(s) | Type | Count | Existing equivalent | Action |
|---|---|---|---|---|
| `index.html` | Homepage prototype | 1 | `/` | UPDATE (re-frame sections, keep Hero/CMS wiring) |
| `bay-area-locksmith.html` | Bay Area hub | 1 | `/locations` (listing) | ADD `/bay-area-locksmith`; redirect `/locations` → hub |
| `locations/*.html` (20 cities) | City pages | 20 | `/locations/[slug]` (1 of 20 exists: San Jose, different slug) | UPDATE template, ADD 19, REMOVE 5 out-of-scope cities |
| `locations/{north,south,east,west}-san-jose-locksmith.html` | San Jose sub-areas | 4 | none | ADD (child of San Jose) |
| `services/{automotive,residential,commercial,emergency}-locksmith.html` | Service categories | 4 | none (flat services) | ADD category type |
| `services/{car-lockout,car-key-replacement,key-fob-programming,transponder-key-programming,ignition-repair}.html` | Automotive services | 5 | car-lockout, car-key-and-fob-replacement | UPDATE/ADD |
| `services/{house-lockout,rekey-locks,lock-change,smart-lock-installation}.html` | Residential services | 4 | residential-lockout, house-rekey, smart-lock-installation | UPDATE/ADD |
| `services/garage-locksmith.html` | Standalone (with disclaimer) | 1 | none | ADD |
| `city-pages-content.json` | 24 location entries (slug, city, subregion, seo_title, meta_description, h1, intro, neighborhoods[], nearby[]; sub-areas add parent_city/parent_slug) | — | seed data | Becomes the seed source |
| `services-content.json` | categories[4], services[9], garage, hub, city_index[20] | — | seed data | Becomes the seed source |
| `DEVELOPER_README.md` | Mapping + rules | — | — | Followed |

**Page count discrepancy (resolved from the package):** the README says `services/` holds "15 pages total" but itemises 4 + 9 + 1 = **14**, and the folder contains 14. So the client's 20 + 4 + 1 + 15 = 40 is really 20 + 4 + 1 + 14 = **39** structural pages; the 40th HTML file is the homepage. Nothing is missing; the "15" is an arithmetic slip. No client confirmation needed for the count. (Related note: `city-pages-content.json._readme` still says "16 priority city pages" — stale text; the file has 24 entries.)

**Package defects to handle (not copied verbatim):**
- Category pages render "Automotive Locksmith Services Services" (template `{h1} Services`) — render as "What's included" instead.
- Hub page meta description omits Tri-Valley ("South Bay, Peninsula & East Bay") — use as supplied, flagged for client.
- City FAQ #1 answer is a bracketed instruction (arrival time must be a tracked, verified figure) — rendered only when `averageArrival` is confirmed.
- Homepage/footer show 16 of 20 cities (4 per region) by design, with "View all 20" link.
- Placeholders everywhere: `tel:+1REALPHONE`, `(XXX) XXX-XXXX`, `[REAL LICENSE NUMBER]`, canonical base `https://888lockandkey.com` — all become centralised config, never literal text.

Package contains **no** reviews, ratings, hours, "24/7" claims, storefront addresses, or out-of-scope cities (San Francisco / Los Gatos are explicitly removed). Good.

---

## Phase 1 — Requirements reconciliation (DONE 2026-09-22)

### Page mapping (existing → client → action)

| Existing | Client | Action |
|---|---|---|
| `/` (CA/AZ/NY hero, 6 city cards, 6 services, trust bar with fake stats, about, reviews marquee, shops, pricing, FAQ) | `index.html` (Bay Area H1, 4-region dispatch grid, emergency band, 4 service categories) | UPDATE — new sections from client; keep Hero component, FAQ; hide reviews/pricing/stats until real data |
| `/locations` (grid of shops) | `bay-area-locksmith.html` | ADD hub at `/bay-area-locksmith`; `/locations` 308 → hub |
| `/locations/san-jose` | `/locations/san-jose-locksmith` | REPLACE slug + content |
| `/locations/{san-francisco,los-angeles,phoenix,scottsdale,new-york-city}` | — | REMOVE (out of scope; never launched publicly, no redirects needed — decision D3) |
| — | 19 further city pages + 4 sub-area pages | ADD |
| `/services` (6 services) | — (no listing page in package; nav links `/services`) | UPDATE to list 4 categories + garage |
| `/services/car-lockout` | same slug | UPDATE content, parent = automotive |
| `/services/car-key-and-fob-replacement` | `/services/car-key-replacement` (+ separate `key-fob-programming`) | REPLACE (redirect old slug) |
| `/services/residential-lockout` | `/services/house-lockout` | REPLACE (redirect) |
| `/services/house-rekey` | `/services/rekey-locks` | REPLACE (redirect) |
| `/services/smart-lock-installation` | same | UPDATE |
| `/services/commercial-and-access-control` | `/services/commercial-locksmith` | REPLACE (redirect) |
| — | `automotive-locksmith`, `residential-locksmith`, `emergency-locksmith`, `transponder-key-programming`, `ignition-repair`, `lock-change`, `garage-locksmith` | ADD |
| `/services/[slug]/[city]` (combo pages, 6×6 today) | not in package | KEEP code, DISABLE by default (decision D4) — NEEDS CLIENT INPUT to re-enable |
| `/about`, `/contact`, `/book`, `/thank-you`, `/faq`, `/pricing`, `/reviews`, `/privacy`, `/terms` | linked from client nav/footer (About, Reviews, Pricing, Contact, Request Service) | KEEP; UPDATE copy that mentions CA/AZ/NY, 24/7, fake stats; pricing/reviews pages show "coming soon"-style empty states until real data |
| Admin `/admin`, `/api/*` | — | KEEP untouched |

### Navigation
- Header (client): Bay Area · Services · Locations · Pricing · Reviews · Contact + Request Service + Call. ("Locations" → hub.)
- Footer columns (client): Services (5) · South Bay (4) · Peninsula (4) · East Bay (4) · Tri-Valley (4) · Company (About, Reviews, Pricing, Contact).

### Internal-linking rules (from README + prototypes)
- City page → 8 service cards (car-lockout, car-key-replacement, key-fob-programming, house-lockout, rekey-locks, garage-locksmith, commercial-locksmith, emergency-locksmith) → "Also Serving" = `nearby[]` → breadcrumb `Home / Bay Area / {City}`.
- Sub-area page → same, breadcrumb `Home / Bay Area / San Jose / {Sub-area}`, cross-links to siblings + parent; excluded from hub grouping and from service "Areas We Serve".
- Hub → 20 cities in 4 regions → 4 category links.
- Category page → sub-service cards (automotive, residential) or included list (commercial, emergency) → Areas We Serve (first 8 of `city_index` + hub link) → related categories.
- Service page → breadcrumb `Home / Services / {Category} / {Service}` → Areas We Serve → related services.
- Homepage → 16 cities + hub, 4 categories, garage (footer).

### SEO changes required
- Titles/descriptions/H1 from JSON; canonical = `NEXT_PUBLIC_SITE_URL` + path (already the mechanism).
- Remove "24/7" from the layout title template and default descriptions.
- Structured data: business is a **Service Area Business** — `Locksmith` with `areaServed` (20 cities) and a single `address` (Santa Clara dispatch hub). City pages must **not** emit a `PostalAddress` for the city (today's `locationSchema` does).
- Sitemap: homepage, hub, 24 locations, 14 services, about/contact/book/faq/pricing/reviews/privacy/terms. Combo pages excluded while disabled.

---

## Phase 2 — Technical architecture & content model

Principle: extend the existing Payload collections; no new framework, no static-HTML port.

### `site-settings` (business configuration — single source of truth)
- Remove fabricated defaults: `phone`, `phoneHref`, `licenseNumber`, `hours`, `rating`, `reviewCount`, `averageArrival` → empty; `serviceAreaLine` → "Serving San Jose & the Entire Bay Area"; `tagline` keep.
- Add `dispatchHubs` array: `{ name, addressLine, city, stateAbbr, postcode }` seeded with **3315 Montgomery Dr, Santa Clara, CA** only.
- Add `pendingInfo` = derived, not stored: admin dashboard shows which required values are still empty.
- Rendering rules: no phone → call buttons read "Call Now" and go to `/book`; no licence → licence line hidden; no rating/count → trust item and `aggregateRating` omitted; no hours → hours line omitted (no "24/7").

### `locations`
- Add `subregion` select: `south-bay | peninsula | east-bay | tri-valley` (labels "South Bay / Silicon Valley", "Peninsula", "East Bay", "Tri-Valley").
- Add `parent` (relationship → locations, for the 4 San Jose sub-areas) and `nearby` (relationship hasMany → locations).
- Keep `neighbourhoods`, `intro`, `seo`, `image` (optional), `services` (relationship, used for the 8 service cards).
- Storefront fields (`shopName`, `addressLine`, `postcode`, `phone`, `hours`, `mapUrl`) stay in the schema for a real hub city but are **not seeded** and are hidden in the UI unless filled; `hours` default "Open 24 hours" removed.
- Slugs follow the client exactly: `{city}-locksmith`.

### `services`
- Add `kind` select: `category | service | standalone`.
- Add `category` (relationship → services, for the 9 sub-services; the 5 categories/standalone have none).
- Add `related` (relationship hasMany → services), `ctaLabel` (e.g. "LOCKED OUT? CALL NOW"), `disclaimer` (garage).
- Reuse `bullets` for "included" lists, `intro`, `seo`. `startingPrice` stays but is unset (pricing is unverified → NEEDS CLIENT INPUT).
- Slugs follow the client exactly.

### Routes
- `/bay-area-locksmith` — new page (groups published locations by `subregion`, excludes sub-areas).
- `/locations/[slug]` — rebuilt to the client template (breadcrumb, H1, intro, neighbourhood pills, 8 service cards, emergency band, FAQ, Also Serving).
- `/services/[slug]` — one route, three renderings by `kind`.
- `/services` — categories + garage.
- Redirects in `next.config.ts`: `/locations` → `/bay-area-locksmith`; old service slugs → new.
- `/services/[slug]/[city]` — unchanged code, `combo-template.enabled = false` in seed.

### Shared components
- `CallButton` (one place for the tel:/fallback rule) used by Header, Footer, StickyCall, Hero, CtaBanner, CallCard, page CTAs.
- `StickyCall` → two-button sticky bar (Call Now + Request Service) per client prototype, always visible on mobile.
- `Breadcrumbs` already in `PageHero`; extend to 4 levels.
- `AreasWeServe` (first 8 cities + hub link) and `RelatedServices` blocks.

### Seed
- Copy `city-pages-content.json` and `services-content.json` into `src/seed/client/` (versioned copy of the package data; the package folder stays untouched as the reference).
- Seed reads those files; creates 24 locations, 14 services, navigation, site settings (no fake values), 3 CMS pages (about/privacy/terms with Bay Area copy), FAQs (client's 3 safe city FAQs + existing generic ones minus 24/7 claims). No reviews.
- `SEED_RESET=1` flag deletes existing services/locations/faqs/reviews before seeding (explicit, documented; needed once on the Supabase database that holds the old CA/AZ/NY content).
- New migrations for both engines.

---

## Phase 3 — Global structure
Header nav + footer columns from client; StickyCall two-button bar; layout metadata without "24/7"; licence line only when set; `CallButton` everywhere; skip-link/ProgressBar preserved.

## Phase 4 — Homepage
Client sections in order: Hero (H1 "Serving All of San Jose & the Entire Bay Area", lede, 3 trust items, Call + Request) → "Where We Dispatch" 4 regions (4 cities each + "View all 20") → emergency band → 4 service categories → FAQ (CMS) → final CTA. Reviews/pricing/about sections hidden until data exists. `home-page` global fields updated/added so all copy stays editable.

## Phase 5 — Bay Area hub & location pages
Hub page; 24 location pages from seed; breadcrumbs; nearby links; sub-area parent linking; service-area schema.

## Phase 6 — Service architecture
14 services (4 categories, 9 sub-services, garage with disclaimer); `/services` index; three renderings; Areas We Serve; related links; redirects from old slugs.

## Phase 7 — Internal linking & SEO
Per-page metadata from JSON; breadcrumb JSON-LD; Locksmith schema as SAB; sitemap/robots; link check across every route (script: crawl local build, assert no 404 and every page reachable); alt text on remaining images.

## Phase 8 — Business data & compliance
`site-settings` empty for phone/licence/hours/rating/count; dispatch hub seeded; admin dashboard "Missing before launch" panel; tracker "Client Information Pending" table. **BSIS licence = P0 launch blocker.**

## Phase 9 — Mobile-first conversion
Sticky bar, click-to-call, CTAs, drawer nav, overflow check at 360/390/768/1024/1440 via headless Chrome (existing CDP test approach).

## Phase 10 — Content & visual QA
Every page: correct city/service, no placeholders, no fake data, no CA/AZ/NY, no "24/7", no broken images.

## Phase 11 — Technical QA
`tsc`, `npm test`, `next build`, route crawl, console check.

## Phase 12 — SEO QA
Unique titles/descriptions, single H1, canonicals, sitemap inclusion, schema validity, no accidental noindex → `seo-qa-report.md`.

## Phase 13 — Client review / staging
Vercel preview with pending-info list, known issues, questions, blockers.

## Phase 14–15 — Production prep & post-deploy QA
Only after client approval and real business data.

---

## Decisions

- **D1** Client JSON is the content source; it is copied into `src/seed/client/` and loaded by the seed. Admins can then edit in Payload as before.
- **D2** URL structure follows the client exactly (`/locations/{city}-locksmith`, `/services/{slug}`, `/bay-area-locksmith`).
- **D3** The five out-of-scope cities are removed without redirects — they only ever existed on test deployments.
- **D4** Service × city combo pages stay in code but are disabled by default (not in the client architecture; would be 336 thin pages). Re-enable is a one-checkbox change once the client asks.
- **D5** No fabricated values anywhere: empty config renders a safe fallback (Call Now → `/book`), never a fake number.
- **D6** Pricing and reviews pages stay (client nav links them) but show honest empty states until real prices/reviews are supplied.
- **D7** Combo template, PageCopy and HomePage defaults lose all "24/7" wording; hours come only from `site-settings.hours`.

## Open questions for the client
1. Confirm Tri-Valley should appear in the hub meta description (package omits it).
2. Confirm North/South/East/West San Jose neighbourhood grouping (README asks for a local sanity check).
3. Starting prices per service (pricing table is hidden until then).
4. Whether service × city pages are wanted later (D4).
5. Real phone, BSIS licence, hours, domain, review rating/count, any additional dispatch hubs.
