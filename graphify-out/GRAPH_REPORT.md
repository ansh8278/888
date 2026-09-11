# Graph Report - web  (2026-09-11)

## Corpus Check
- 80 files · ~51,920 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 448 nodes · 1030 edges · 18 communities (17 shown, 1 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 38 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0863359c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- payload.config.ts
- package.json
- Enquiries Collection
- payload-types.ts
- importMap.js
- lib/data.ts
- compilerOptions
- notify.ts
- Icon.tsx
- thank-you/page.tsx
- enquiry/route.ts
- seed/index.ts
- scripts
- backup.mjs
- [...slug]/route.ts
- App Icon (Padlock Favicon)
- next.config.ts
- Native <details>/<summary> FAQ Accordions

## God Nodes (most connected - your core abstractions)
1. `getSiteSettings` - 34 edges
2. `getPageCopy` - 30 edges
3. `payload` - 25 edges
4. `breadcrumbSchema()` - 23 edges
5. `getServices` - 22 edges
6. `next` - 20 edges
7. `getLocations` - 20 edges
8. `compilerOptions` - 17 edges
9. `Icon()` - 15 edges
10. `client()` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Agent Rules Block` --conceptually_related_to--> `888 Lock & Key Website + CMS`  [INFERRED]
  AGENTS.md → README.md
- `generateMetadata()` --calls--> `getPageCopy`  [EXTRACTED]
  src/app/(frontend)/thank-you/page.tsx → src/lib/data.ts
- `CLAUDE.md Include of AGENTS.md` --references--> `Next.js Agent Rules Block`  [EXTRACTED]
  CLAUDE.md → AGENTS.md
- `generateStaticParams()` --calls--> `getPages`  [EXTRACTED]
  src/app/(frontend)/[slug]/page.tsx → src/lib/data.ts
- `generateMetadata()` --calls--> `getPage`  [EXTRACTED]
  src/app/(frontend)/[slug]/page.tsx → src/lib/data.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **SQLite Data Durability Strategy** — readme_persistent_disk, readme_payload_migrate_on_start, readme_backup_vacuum_into, readme_postgres_migration_path, readme_payload_cms [EXTRACTED 1.00]
- **Lead Capture Flow: form to dispatcher** — readme_enquiry_api_endpoint, readme_honeypot_spam, readme_rate_limiting, readme_enquiries_collection, readme_lead_alert_emails, readme_notify_lib, readme_thank_you_page, readme_new_enquiries_banner [EXTRACTED 1.00]
- **Admin UX for Non-Technical Staff** — readme_admin_dashboard, readme_new_enquiries_banner, readme_sidebar_icons, readme_labelled_logout, readme_combo_template [INFERRED 0.85]

## Communities (18 total, 1 thin omitted)

### Community 0 - "payload.config.ts"
Cohesion: 0.11
Nodes (29): payload, adminFieldOnly(), adminOnly(), adminOrSelf(), anyone(), Role, roleOf(), staff() (+21 more)

### Community 1 - "package.json"
Cohesion: 0.05
Nodes (37): allowScripts, esbuild@0.18.20, esbuild@0.25.12, esbuild@0.28.2, dependencies, graphql, next, payload (+29 more)

### Community 2 - "Enquiries Collection"
Cohesion: 0.07
Nodes (38): generate-agent-files.js, Next.js Agent Rules Block, Next.js Version Diverges From Training Data, CLAUDE.md Include of AGENTS.md, 888 Lock & Key Website + CMS, Custom Admin Dashboard, Daily VACUUM INTO Backup, Service-in-City Combo Pages (+30 more)

### Community 3 - "payload-types.ts"
Cohesion: 0.05
Nodes (37): Auth, CollectionsWidget, ComboTemplate, ComboTemplateSelect, Config, EnquiriesSelect, Enquiry, FaqsSelect (+29 more)

### Community 4 - "importMap.js"
Cohesion: 0.09
Nodes (13): importMap, Args, Args, Args, count(), Dashboard(), Lead, SECTIONS (+5 more)

### Community 6 - "lib/data.ts"
Cohesion: 0.09
Nodes (77): next, BookPage(), generateMetadata(), ContactPage(), generateMetadata(), FaqPage(), generateMetadata(), generateMetadata() (+69 more)

### Community 7 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 8 - "notify.ts"
Cohesion: 0.22
Nodes (15): @payloadcms/email-nodemailer, emailAdapter, FROM_ADDRESS, FROM_NAME, notifyRecipients(), smtpConfigured, customerEmail(), dispatcherEmail() (+7 more)

### Community 9 - "Icon.tsx"
Cohesion: 0.09
Nodes (23): react, EnquiryForm(), Option, Props, State, caveat, generateMetadata(), inter (+15 more)

### Community 10 - "thank-you/page.tsx"
Cohesion: 0.36
Nodes (5): generateMetadata(), generateMetadata(), ThankYouPage(), fillTemplate(), vars

### Community 11 - "enquiry/route.ts"
Cohesion: 0.19
Nodes (13): clean(), looksLikePhone(), MAX, POST(), TYPES, buckets, clientKey(), Hit (+5 more)

### Community 13 - "seed/index.ts"
Cohesion: 0.25
Nodes (13): doc(), heading(), LexNode, list(), para(), textNode(), FAQS, LOCATIONS (+5 more)

### Community 15 - "scripts"
Cohesion: 0.14
Nodes (14): scripts, backup, build, dev, devsafe, email:check, generate:importmap, generate:types (+6 more)

### Community 17 - "backup.mjs"
Cohesion: 0.25
Nodes (8): dbFile, dest, keep, mb(), mediaPath, root, run(), stamp

### Community 18 - "[...slug]/route.ts"
Cohesion: 0.29
Nodes (6): DELETE, GET, OPTIONS, PATCH, POST, PUT

### Community 19 - "App Icon (Padlock Favicon)"
Cohesion: 0.50
Nodes (5): App Icon (Padlock Favicon), Next.js App Router icon.svg File Convention, Orange Brand Color #ea580c, Closed Padlock Glyph, Security / Privacy Branding Theme

### Community 20 - "next.config.ts"
Cohesion: 0.50
Nodes (3): dirname, __filename, nextConfig

## Ambiguous Edges - Review These
- `App Icon (Padlock Favicon)` → `Security / Privacy Branding Theme`  [AMBIGUOUS]
  src/app/icon.svg · relation: rationale_for

## Knowledge Gaps
- **156 isolated node(s):** `__filename`, `dirname`, `nextConfig`, `name`, `version` (+151 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 174 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `App Icon (Padlock Favicon)` and `Security / Privacy Branding Theme`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **Why does `payload` connect `payload.config.ts` to `package.json`, `importMap.js`, `lib/data.ts`, `notify.ts`, `enquiry/route.ts`, `seed/index.ts`?**
  _High betweenness centrality (0.164) - this node is a cross-community bridge._
- **Why does `next` connect `lib/data.ts` to `package.json`, `importMap.js`, `Icon.tsx`, `thank-you/page.tsx`, `next.config.ts`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `__filename`, `dirname`, `nextConfig` to the rest of the system?**
  _156 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `payload.config.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10884353741496598 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.045454545454545456 - nodes in this community are weakly interconnected._