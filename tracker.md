# 888 Locksmith Implementation Tracker

## Project Status

Overall Status: READY FOR CLIENT REVIEW (staging deploy pending) — NOT production-ready (P0 client inputs missing)
Last Updated: 2026-09-22
Current Phase: Phase 10 — Client review / staging (Phases 0–9 complete; Phase 7 compliance blocked on client data)

Plan: `implementation_plan.md` · Checkpoint: git tag `checkpoint-pre-bayarea-2026-09-22`

---

## Phase Status

| Phase | Status | Progress | Notes |
|------|--------|----------|-------|
| Phase 0 - Audit | DONE | 100% | Existing project + client package inventoried; baseline tsc/tests/build green |
| Phase 1 - Planning | DONE | 100% | Page mapping, 39-vs-40 resolved, decisions D1–D7 |
| Phase 2 - Architecture | DONE | 100% | Model extended, seed from client JSON, CallButton fallback, redirects, migrations (both engines) verified |
| Phase 3 - Core Website | DONE | 100% | Header/footer/sticky bar/global copy; About + FAQ from CMS only; SAB structured data |
| Phase 4 - Homepage | DONE | 100% | Client section order; reviews/pricing hidden until real data |
| Phase 5 - Location Pages | DONE | 100% | Hub + 20 cities + 4 districts, client template, SAB schema |
| Phase 6 - Service Pages | DONE | 100% | 4 categories + 9 services + garage (disclaimer kept); three renderings on one route |
| Phase 7 - SEO/Internal Linking | DONE | 100% | 49 pages: no 404s, no orphans, all in sitemap; 0 SEO problems (`npm run crawl`, `npm run seo:check`) |
| Phase 7 - Business/Compliance | BLOCKED | 60% | Mechanism done (Site settings + dashboard checklist); values needed from client: phone, BSIS licence, hours, domain, rating/count, hub ZIP |
| Phase 8 - Responsive/Conversion | DONE | 100% | 45 renders at 360/390/768/1024/1440: no overflow, sticky bar < 860px, menu opens on tap, no console errors (`npm run qa:responsive`) |
| Phase 9 - QA | DONE | 100% | Content (forbidden-text scan on all 49 pages), technical (tsc, 7 test suites, build, crawl), SEO (`seo-qa-report.md`, 0 problems) |
| Phase 10 - Client Review | IN PROGRESS | 50% | Code ready; staging deploy needs the owner's Vercel login (`vercel --prod`, then `SEED_RESET=1 npm run seed` against Supabase) |
| Phase 11 - Production | BLOCKED | 0% | P0 blockers below |

---

## Detailed Task Tracker

| ID | Task | Phase | Status | Priority | File/Area | Notes |
|----|------|-------|--------|----------|-----------|-------|
| T001 | Audit existing project (framework, routes, model, components, SEO, deploy) | 0 | DONE | P0 | whole repo | See plan §Phase 0 |
| T002 | Inventory client package (40 HTML, 2 JSON, README) | 0 | DONE | P0 | ../888LockKey_Full_Site_Package | |
| T003 | Baseline verification (tsc, npm test, next build) | 0 | DONE | P0 | — | All green 2026-09-22 |
| T004 | Git checkpoint tag | 0 | DONE | P0 | git | `checkpoint-pre-bayarea-2026-09-22` |
| T005 | Resolve 39 vs 40 page discrepancy | 1 | DONE | P1 | plan | Services are 14 not 15; 39 structural + homepage = 40 files |
| T006 | Existing → client page mapping | 1 | DONE | P1 | plan | |
| T010 | `site-settings`: remove fake defaults, add `dispatchHubs`, clear 24/7 | 2 | DONE | P0 | src/globals/SiteSettings.ts | |
| T011 | `locations`: add subregion, parent, nearby; drop fake hours default | 2 | DONE | P0 | src/collections/Locations.ts | |
| T012 | `services`: add kind, category, related, ctaLabel, disclaimer | 2 | DONE | P0 | src/collections/Services.ts | |
| T013 | Copy client JSON into `src/seed/client/`; rewrite seed from it; `SEED_RESET` flag | 2 | DONE | P0 | src/seed | No reviews, no prices, no fake business data |
| T014 | Migrations (sqlite + postgres) for schema changes | 2 | DONE | P0 | src/migrations, src/migrations-pg | |
| T015 | `CallButton` shared component with no-phone fallback | 2 | DONE | P0 | src/components | Replaces ad-hoc tel: links |
| T016 | Redirects: `/locations`→hub, old service slugs→new | 2 | DONE | P1 | next.config.ts | |
| T020 | Header nav + footer columns per client | 3 | DONE | P1 | Navigation seed, Footer.tsx | |
| T021 | Sticky two-button mobile bar | 3 | DONE | P0 | StickyCall.tsx, site.css | |
| T022 | Remove "24/7" and CA/AZ/NY wording from layout, footer, PageCopy, ComboTemplate, HomePage, contact/faq/about | 3 | DONE | P0 | many | Rule 9 |
| T023 | Licence line renders only when set | 3 | DONE | P0 | Footer, Header, Hero | |
| T030 | Homepage re-frame per client index.html | 4 | DONE | P0 | src/app/(frontend)/page.tsx, HomePage global | |
| T040 | `/bay-area-locksmith` hub page | 5 | DONE | P0 | new route | |
| T041 | Location page template per client (breadcrumb, pills, 8 cards, FAQ, Also Serving) | 5 | DONE | P0 | locations/[slug]/page.tsx | |
| T042 | Sub-area pages (parent breadcrumb, sibling links) | 5 | DONE | P0 | same | |
| T043 | Service-area schema (no city PostalAddress) | 5 | DONE | P0 | src/lib/schema.tsx | |
| T050 | `/services` index (categories + garage) | 6 | DONE | P1 | services/page.tsx | |
| T051 | Service page: category / service / standalone renderings | 6 | DONE | P0 | services/[slug]/page.tsx | Garage disclaimer must stay |
| T052 | Areas We Serve + Related Services blocks | 6 | DONE | P1 | components | |
| T053 | Disable combo pages by default; exclude from sitemap | 6 | DONE | P1 | seed, sitemap.ts | D4 |
| T060 | Metadata from JSON; breadcrumb JSON-LD; sitemap/robots | 7 | DONE | P0 | pages, sitemap.ts | |
| T061 | Link crawl script (no 404s, no orphans) | 7 | DONE | P1 | scripts/ | |
| T070 | Admin "Missing before launch" panel | 8 | DONE | P1 | components/admin/Dashboard.tsx | |
| T071 | Enter real phone / licence / hours / domain / rating / count | 8 | NEEDS CLIENT INPUT | P0 | site-settings | Phone done 2026-09-22: (669) 366-5249. Licence, hours, domain, rating/count, prices, hub ZIP still pending. |
| T080 | Responsive + conversion test at 5 widths | 9 | DONE | P0 | headless Chrome | |
| T090 | Content/visual QA every page | 10 | DONE | P0 | — | |
| T091 | Technical QA (build, tests, routes, console) | 11 | DONE | P0 | — | |
| T092 | SEO QA report | 12 | DONE | P0 | seo-qa-report.md | |
| T100 | Staging deploy + client review list | 13 | IN PROGRESS | P1 | Vercel | |
| T110 | Production configuration | 14 | BLOCKED | P0 | — | After approval + real data |

---

## Production readiness — what is left

**Done (nothing more needed from the developer side):**
security headers, HTTPS/HSTS, 404 page, robots + sitemap, OpenGraph + Twitter
card, favicon, form spam protection (Zod + rate limit + honeypot, all verified
live), admin/API locked down (403 to anonymous), cached pages with instant
purge on save (TTFB ~0.25–0.45s), Analytics/Search Console fields ready to
fill in, Supabase daily backups, Vercel logs for errors.

**Still required, in order:**

| # | Item | Who | Notes |
|---|---|---|---|
| 1 | BSIS licence number | Client | **Legal blocker** — CA Locksmith Act requires it on all advertising |
| 2 | Operating hours | Client | No hours shown until then; never claim 24/7 unless true |
| 3 | Google rating + review count, and real reviews | Client | Reviews page and star markup stay hidden until entered |
| 4 | Starting prices per service | Client | Pricing page shows "quoted on the phone" until then |
| 5 | ZIP for 3315 Montgomery Dr, Santa Clara | Client | Completes the address for Google |
| 6 | Real photos | Client | Current hero/team images are AI placeholders |
| 7 | Business email for alerts + sending | Client | Live site still uses a personal Gmail for SMTP and `NOTIFY_EMAIL` |
| 8 | Production domain | Client | Then: add in Vercel → Domains, update `NEXT_PUBLIC_SITE_URL`, redeploy |
| 9 | Rotate the admin password; add staff logins | Owner | `admin@888lockandkey.com` currently the only account |
| 10 | Google Analytics + Search Console IDs | Client | Paste into Admin → Site settings → Tracking; submit the sitemap |
| 11 | Client approval of content | Client | Including the North/South/East/West San Jose grouping and Tri-Valley wording |

## Client Information Pending

| Information | Status | Value | Required Before |
|-------------|--------|-------|-----------------|
| Business phone | **DONE** | (669) 366-5249 | — |
| BSIS license | Pending | — | Production (P0 — CA Locksmith Act) |
| Dispatch hubs | Partial | 3315 Montgomery Dr, Santa Clara (ZIP not supplied) | Production |
| Operating hours | Pending | — | Production (no "24/7" until confirmed) |
| Production domain | Pending | — (package assumes 888lockandkey.com) | Production |
| Review count | Pending | — | Production (reviews section hidden until then) |
| Review rating | Pending | — | Production |
| Starting prices | Pending | — | Pricing page/table hidden until then |
| Verified arrival time | Pending | — | City FAQ #1 hidden until then |

---

## Known Issues

- KI-11 Local test seeds ran with the real `BLOB_READ_WRITE_TOKEN` from `.env`, so a few test copies of `hero*.png` / `san-jose*.jpg` sit in the Vercel Blob store. Harmless; delete from Vercel → Storage → Blob when convenient. (Test runs now unset the token.)
- KI-12 All photos are AI placeholders (hero, team). The "24/7 MOBILE SERVICE" decal painted on the van was patched out; real photos should come from the client before launch (P1).

- KI-6 FaqExplorer previously merged a hard-coded FAQ list with unverified claims (arrival time, fees, warranty, payment methods) into every FAQ page — removed; FAQs now come only from the admin. Those questions can be re-added by the client once the answers are confirmed.
- KI-7 Location/service page templates still contain old "24/7" title fallbacks and the shop-card layout — replaced in Phases 5–6 (T041, T051). Homepage/About/Contact/Book/FAQ are clean.
- KI-8 City ordering: the client's homepage picks 4 cities per region that differ from its own footer/hub order (e.g. East Bay). The site uses the hub (`city_index`) order everywhere for consistency — flag to client.
- KI-9 `home-page` global still has unused "shops" fields (schema cleanup, P3).

- KI-1 Existing Supabase database holds the old CA/AZ/NY content; the new seed must be run with `SEED_RESET=1` once (destructive by design, documented).
- KI-2 Client hub meta description omitted Tri-Valley; the site's version adds it (the client's own city list includes Tri-Valley). Flag to client.
- KI-10 Several client-supplied titles exceed ~70 characters (e.g. category pages, San Jose). Kept verbatim; Google may truncate. Listed under Warnings in `seo-qa-report.md`.
- KI-3 Client category-page heading bug ("… Services Services") — not reproduced; rendered as "What's included".
- KI-4 `city-pages-content.json._readme` says 16 cities; file has 24. Cosmetic.
- KI-5 Combo pages (`/services/[slug]/[city]`) exist in code; disabled by default (D4).

---

## Decisions

- D1 Client JSON copied into `src/seed/client/` as the content source; editable in Payload afterwards.
- D2 URLs follow the client package exactly.
- D3 Out-of-scope cities removed without redirects (never publicly launched).
- D4 Combo pages kept in code, disabled by default.
- D5 No fabricated values; empty config → safe fallback (Call Now → `/book`).
- D6 Pricing/Reviews pages kept with honest empty states.
- D7 All "24/7" wording removed; hours only from `site-settings.hours`.

---

## Change Log

- 2026-09-22 — Footer rebuilt after a live-site review: the link columns are editor-controlled, so they now sit in their own auto-fitting grid (6 columns on desktop, 2 on phones) instead of a fixed 5-column outer grid; the dispatch call button fills its card and wraps instead of becoming an orange blob; brand name no longer breaks across lines. Header: below 1100px the menu folds into the burger (the links + phone + CTA no longer fit), and below 520px the phone becomes a round call button (the full number is in the sticky bar). Speed: pages were re-querying Supabase on every visit (`force-dynamic`, `no-store`, TTFB 1.5–3s) — now cached with a 1-hour safety window and purged instantly by the existing `revalidateSite` hook on every admin save (verified: an edit appeared on the next request). Responsive checker also asserts the footer call button is not squeezed.

- 2026-09-22 — Staging live at https://888-eosin.vercel.app with the Bay Area content (`SEED_RESET=1 npm run seed` against Supabase). Verified on the live site: 49 pages, no broken links/orphans, 0 SEO problems, 45 responsive renders clean, booking form submits and saves, admin reachable, Service Area Business schema correct. Real business phone **(669) 366-5249** entered — every call button is now a tel: link and the number is in the structured data. `NEXT_PUBLIC_SITE_URL` fixed to the live URL (was 888.vercel.app).

- 2026-09-22 — Phases 8–9: admin dashboard shows a "Missing before launch" checklist (phone, BSIS licence, hours, rating/count, hub ZIP) and no longer mentions shops/combo pages; `scripts/responsive-check.mjs` (headless Chrome, 5 widths, real tap on the menu, console errors, admin render); sticky bar now shows below 860px like the client prototype; FAQ buttons wrap on narrow phones; Hero shows one button when there is no phone; pricing and reviews pages have honest empty states; the "24/7" decal was painted out of the placeholder images; seed uploads stay local when the Blob token is unset. Verified with a phone/licence/hours entered via the API: every call button becomes a tel: link with the client's CTA wording, licence and hours appear, structured data carries the phone.

- 2026-09-22 — Phase 7: `scripts/crawl.mjs` (broken links, orphans, forbidden text) and `scripts/seo-check.mjs` (unique title/description, single H1, canonical, JSON-LD validity, img alt → `seo-qa-report.md`) added; both clean on the seeded build. Contact page description, `/services` title and hub title/description tightened.

- 2026-09-22 — Phase 6: `/services/[slug]` rebuilt: category pages list their services as cards (Automotive, Residential) or an included-list (Commercial, Emergency); Garage keeps its lock-only disclaimer box; individual services sit under their category in the breadcrumb (Home / Services / Category / Service); every service page has the emergency band, "Areas We Serve" (first 8 hub cities + link to all) and "You May Also Need" from `related`; `/services` shows the 4 categories + Garage. Combo pages remain disabled and out of the sitemap.

- 2026-09-22 — Phase 5: `/bay-area-locksmith` hub (4 regions, 20 cities, category links); `/locations/[slug]` rebuilt to the client template (breadcrumb Home / Bay Area / [San Jose /] City, H1 "Mobile Locksmith in X, CA", intro + CTAs, neighborhood pills, 8 service cards with {city} text, emergency band, city FAQs — arrival question only with a verified figure — and "Also Serving" from `nearby`); old `/locations` listing removed (redirects to hub); PageHero gained an actions slot; seed also resets page-copy wording for existing databases.

- 2026-09-22 — Phases 3–4: homepage rebuilt in the client's section order (hero → 4-region dispatch grid → emergency band → 4 categories → about → FAQ; reviews/pricing only when data exists); About page text now comes from the admin "About Us" page, hubs from Site settings; FAQ page uses admin FAQs only; JSON-LD is a Service Area Business (hub address, 20 cities as areaServed, no invented hours/prices); SQLite migration FKs fixed (cascade) so `SEED_RESET=1` works; cities ordered as in the client's hub listing.

- 2026-09-22 — Phase 2 done: `locations` (+subregion, parent, nearby), `services` (+kind, category, related, cityCard, ctaLabel, disclaimer; price optional), `site-settings` (fake defaults removed, +dispatchHubs), globals' defaults re-worded; seed rewritten to load `src/seed/client/*.json` (14 services, 24 locations, nav, no business data; `SEED_RESET=1` to replace old content); `CallButton` + `phoneOf()` replace every hard-coded tel: link (no phone → Request Service); Footer/StickyCall rebuilt per client; Contact/Book show dispatch hubs, not shops; redirects for old URLs; SQLite dev-push disabled (migrations only); migrations for both engines; tests +contact. Verified: tsc, 7 test suites, build, all routes 200, no `tel:null`.

- 2026-09-22 — Phase 0/1: audit complete, `implementation_plan.md` and `tracker.md` created, git checkpoint tagged. No application code changed.
