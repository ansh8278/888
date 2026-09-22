# 888 Locksmith Implementation Tracker

## Project Status

Overall Status: IN PROGRESS
Last Updated: 2026-09-22
Current Phase: Phase 2 — Architecture (Phases 0–1 complete)

Plan: `implementation_plan.md` · Checkpoint: git tag `checkpoint-pre-bayarea-2026-09-22`

---

## Phase Status

| Phase | Status | Progress | Notes |
|------|--------|----------|-------|
| Phase 0 - Audit | DONE | 100% | Existing project + client package inventoried; baseline tsc/tests/build green |
| Phase 1 - Planning | DONE | 100% | Page mapping, 39-vs-40 resolved, decisions D1–D7 |
| Phase 2 - Architecture | NOT STARTED | 0% | Content model + routes + shared components |
| Phase 3 - Core Website | NOT STARTED | 0% | Header/footer/sticky bar/global copy |
| Phase 4 - Location Pages | NOT STARTED | 0% | Hub + 20 cities + 4 sub-areas |
| Phase 5 - Service Pages | NOT STARTED | 0% | 4 categories + 9 services + garage |
| Phase 6 - SEO/Internal Linking | NOT STARTED | 0% | |
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
| T010 | `site-settings`: remove fake defaults, add `dispatchHubs`, clear 24/7 | 2 | NOT STARTED | P0 | src/globals/SiteSettings.ts | |
| T011 | `locations`: add subregion, parent, nearby; drop fake hours default | 2 | NOT STARTED | P0 | src/collections/Locations.ts | |
| T012 | `services`: add kind, category, related, ctaLabel, disclaimer | 2 | NOT STARTED | P0 | src/collections/Services.ts | |
| T013 | Copy client JSON into `src/seed/client/`; rewrite seed from it; `SEED_RESET` flag | 2 | NOT STARTED | P0 | src/seed | No reviews, no prices, no fake business data |
| T014 | Migrations (sqlite + postgres) for schema changes | 2 | NOT STARTED | P0 | src/migrations, src/migrations-pg | |
| T015 | `CallButton` shared component with no-phone fallback | 2 | NOT STARTED | P0 | src/components | Replaces ad-hoc tel: links |
| T016 | Redirects: `/locations`→hub, old service slugs→new | 2 | NOT STARTED | P1 | next.config.ts | |
| T020 | Header nav + footer columns per client | 3 | NOT STARTED | P1 | Navigation seed, Footer.tsx | |
| T021 | Sticky two-button mobile bar | 3 | NOT STARTED | P0 | StickyCall.tsx, site.css | |
| T022 | Remove "24/7" and CA/AZ/NY wording from layout, footer, PageCopy, ComboTemplate, HomePage, contact/faq/about | 3 | NOT STARTED | P0 | many | Rule 9 |
| T023 | Licence line renders only when set | 3 | NOT STARTED | P0 | Footer, Header, Hero | |
| T030 | Homepage re-frame per client index.html | 4 | NOT STARTED | P0 | src/app/(frontend)/page.tsx, HomePage global | |
| T040 | `/bay-area-locksmith` hub page | 5 | NOT STARTED | P0 | new route | |
| T041 | Location page template per client (breadcrumb, pills, 8 cards, FAQ, Also Serving) | 5 | NOT STARTED | P0 | locations/[slug]/page.tsx | |
| T042 | Sub-area pages (parent breadcrumb, sibling links) | 5 | NOT STARTED | P0 | same | |
| T043 | Service-area schema (no city PostalAddress) | 5 | NOT STARTED | P0 | src/lib/schema.tsx | |
| T050 | `/services` index (categories + garage) | 6 | NOT STARTED | P1 | services/page.tsx | |
| T051 | Service page: category / service / standalone renderings | 6 | NOT STARTED | P0 | services/[slug]/page.tsx | Garage disclaimer must stay |
| T052 | Areas We Serve + Related Services blocks | 6 | NOT STARTED | P1 | components | |
| T053 | Disable combo pages by default; exclude from sitemap | 6 | NOT STARTED | P1 | seed, sitemap.ts | D4 |
| T060 | Metadata from JSON; breadcrumb JSON-LD; sitemap/robots | 7 | NOT STARTED | P0 | pages, sitemap.ts | |
| T061 | Link crawl script (no 404s, no orphans) | 7 | NOT STARTED | P1 | scripts/ | |
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

- KI-1 Existing Supabase database holds the old CA/AZ/NY content; the new seed must be run with `SEED_RESET=1` once (destructive by design, documented).
- KI-2 Client hub meta description omits Tri-Valley — used as supplied, flagged.
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

- 2026-09-22 — Phase 0/1: audit complete, `implementation_plan.md` and `tracker.md` created, git checkpoint tagged. No application code changed.
