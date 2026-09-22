# 888 Locksmith Implementation Tracker

## Project Status

Overall Status: IN PROGRESS
Last Updated: 2026-09-22
Current Phase: Phase 8 — Business data & compliance (Phases 0–7 complete)

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
| Phase 7 - Business/Compliance | BLOCKED | 0% | Needs real phone, BSIS licence, hours, domain, reviews |
| Phase 8 - Responsive/Conversion | NOT STARTED | 0% | |
| Phase 9 - QA | NOT STARTED | 0% | |
| Phase 10 - Client Review | NOT STARTED | 0% | |
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
| T070 | Admin "Missing before launch" panel | 8 | NOT STARTED | P1 | components/admin/Dashboard.tsx | |
| T071 | Enter real phone / licence / hours / domain / rating / count | 8 | NEEDS CLIENT INPUT | P0 | site-settings | |
| T080 | Responsive + conversion test at 5 widths | 9 | NOT STARTED | P0 | headless Chrome | |
| T090 | Content/visual QA every page | 10 | NOT STARTED | P0 | — | |
| T091 | Technical QA (build, tests, routes, console) | 11 | NOT STARTED | P0 | — | |
| T092 | SEO QA report | 12 | NOT STARTED | P0 | seo-qa-report.md | |
| T100 | Staging deploy + client review list | 13 | NOT STARTED | P1 | Vercel | |
| T110 | Production configuration | 14 | BLOCKED | P0 | — | After approval + real data |

---

## Client Information Pending

| Information | Status | Value | Required Before |
|-------------|--------|-------|-----------------|
| Business phone | Pending | — | Production |
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

- 2026-09-22 — Phase 7: `scripts/crawl.mjs` (broken links, orphans, forbidden text) and `scripts/seo-check.mjs` (unique title/description, single H1, canonical, JSON-LD validity, img alt → `seo-qa-report.md`) added; both clean on the seeded build. Contact page description, `/services` title and hub title/description tightened.

- 2026-09-22 — Phase 6: `/services/[slug]` rebuilt: category pages list their services as cards (Automotive, Residential) or an included-list (Commercial, Emergency); Garage keeps its lock-only disclaimer box; individual services sit under their category in the breadcrumb (Home / Services / Category / Service); every service page has the emergency band, "Areas We Serve" (first 8 hub cities + link to all) and "You May Also Need" from `related`; `/services` shows the 4 categories + Garage. Combo pages remain disabled and out of the sitemap.

- 2026-09-22 — Phase 5: `/bay-area-locksmith` hub (4 regions, 20 cities, category links); `/locations/[slug]` rebuilt to the client template (breadcrumb Home / Bay Area / [San Jose /] City, H1 "Mobile Locksmith in X, CA", intro + CTAs, neighborhood pills, 8 service cards with {city} text, emergency band, city FAQs — arrival question only with a verified figure — and "Also Serving" from `nearby`); old `/locations` listing removed (redirects to hub); PageHero gained an actions slot; seed also resets page-copy wording for existing databases.

- 2026-09-22 — Phases 3–4: homepage rebuilt in the client's section order (hero → 4-region dispatch grid → emergency band → 4 categories → about → FAQ; reviews/pricing only when data exists); About page text now comes from the admin "About Us" page, hubs from Site settings; FAQ page uses admin FAQs only; JSON-LD is a Service Area Business (hub address, 20 cities as areaServed, no invented hours/prices); SQLite migration FKs fixed (cascade) so `SEED_RESET=1` works; cities ordered as in the client's hub listing.

- 2026-09-22 — Phase 2 done: `locations` (+subregion, parent, nearby), `services` (+kind, category, related, cityCard, ctaLabel, disclaimer; price optional), `site-settings` (fake defaults removed, +dispatchHubs), globals' defaults re-worded; seed rewritten to load `src/seed/client/*.json` (14 services, 24 locations, nav, no business data; `SEED_RESET=1` to replace old content); `CallButton` + `phoneOf()` replace every hard-coded tel: link (no phone → Request Service); Footer/StickyCall rebuilt per client; Contact/Book show dispatch hubs, not shops; redirects for old URLs; SQLite dev-push disabled (migrations only); migrations for both engines; tests +contact. Verified: tsc, 7 test suites, build, all routes 200, no `tel:null`.

- 2026-09-22 — Phase 0/1: audit complete, `implementation_plan.md` and `tracker.md` created, git checkpoint tagged. No application code changed.
