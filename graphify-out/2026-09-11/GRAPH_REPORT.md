# Graph Report - web  (2026-09-08)

## Corpus Check
- Corpus is ~40,430 words - fits in a single context window. You may not need a graph.

## Summary
- 439 nodes · 983 edges · 22 communities (21 shown, 1 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 36 edges (avg confidence: 0.85)
- Token cost: 83,820 input · 0 output

## Community Hubs (Navigation)
- Payload Collections & Access Control
- Package Dependencies
- Project Docs & Design Rationale
- Generated Payload Types
- Admin Dashboard & Payload UI
- Booking & Contact Pages
- Content Blocks & Icons
- TypeScript Configuration
- Email Notification Pipeline
- Site Layout, Header & Footer
- Location & Service-Combo Pages
- Enquiry API & Rate Limiting
- Reviews & Structured Data
- Seed Data & Rich Text
- FAQ & Pricing Pages
- NPM Scripts
- CMS Data Fetch Layer
- Database Backup Script
- Payload REST API Route
- App Icon & Branding
- Next.js Config
- No-JS Frontend Patterns

## God Nodes (most connected - your core abstractions)
1. `getSiteSettings` - 34 edges
2. `payload` - 24 edges
3. `breadcrumbSchema()` - 23 edges
4. `getServices` - 22 edges
5. `next` - 20 edges
6. `getLocations` - 20 edges
7. `compilerOptions` - 17 edges
8. `Icon()` - 15 edges
9. `scripts` - 14 edges
10. `PageHero()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `Next.js Agent Rules Block` --conceptually_related_to--> `888 Lock & Key Website + CMS`  [INFERRED]
  AGENTS.md → README.md
- `generateStaticParams()` --calls--> `getPages`  [EXTRACTED]
  src/app/(frontend)/[slug]/page.tsx → src/lib/data.ts
- `generateStaticParams()` --calls--> `getLocations`  [EXTRACTED]
  src/app/(frontend)/locations/[slug]/page.tsx → src/lib/data.ts
- `NotFound()` --calls--> `getSiteSettings`  [EXTRACTED]
  src/app/(frontend)/not-found.tsx → src/lib/data.ts
- `generateStaticParams()` --calls--> `getComboPairs`  [EXTRACTED]
  src/app/(frontend)/services/[slug]/[city]/page.tsx → src/lib/data.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Lead Capture Flow: form to dispatcher** — readme_enquiry_api_endpoint, readme_honeypot_spam, readme_rate_limiting, readme_enquiries_collection, readme_lead_alert_emails, readme_notify_lib, readme_thank_you_page, readme_new_enquiries_banner [EXTRACTED 1.00]
- **SQLite Data Durability Strategy** — readme_persistent_disk, readme_payload_migrate_on_start, readme_backup_vacuum_into, readme_postgres_migration_path, readme_payload_cms [EXTRACTED 1.00]
- **Admin UX for Non-Technical Staff** — readme_admin_dashboard, readme_new_enquiries_banner, readme_sidebar_icons, readme_labelled_logout, readme_combo_template [INFERRED 0.85]

## Communities (22 total, 1 thin omitted)

### Community 0 - "Payload Collections & Access Control"
Cohesion: 0.12
Nodes (28): payload, adminFieldOnly(), adminOnly(), adminOrSelf(), anyone(), Role, roleOf(), staff() (+20 more)

### Community 1 - "Package Dependencies"
Cohesion: 0.05
Nodes (37): allowScripts, esbuild@0.18.20, esbuild@0.25.12, esbuild@0.28.2, dependencies, graphql, next, payload (+29 more)

### Community 2 - "Project Docs & Design Rationale"
Cohesion: 0.07
Nodes (38): generate-agent-files.js, Next.js Agent Rules Block, Next.js Version Diverges From Training Data, CLAUDE.md Include of AGENTS.md, 888 Lock & Key Website + CMS, Custom Admin Dashboard, Daily VACUUM INTO Backup, Service-in-City Combo Pages (+30 more)

### Community 3 - "Generated Payload Types"
Cohesion: 0.06
Nodes (34): Auth, CollectionsWidget, ComboTemplate, ComboTemplateSelect, Config, EnquiriesSelect, Enquiry, FaqsSelect (+26 more)

### Community 4 - "Admin Dashboard & Payload UI"
Cohesion: 0.09
Nodes (13): importMap, Args, Args, Args, count(), Dashboard(), Lead, SECTIONS (+5 more)

### Community 5 - "Booking & Contact Pages"
Cohesion: 0.13
Nodes (22): next, EnquiryForm(), Option, Props, State, BookPage(), metadata, ContactPage() (+14 more)

### Community 6 - "Content Blocks & Icons"
Cohesion: 0.17
Nodes (20): LocationsIndex(), metadata, NotFound(), CallCard(), LocationCard(), mediaAlt(), mediaUrl(), PricingTable() (+12 more)

### Community 7 - "TypeScript Configuration"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, baseUrl, esModuleInterop, incremental, isolatedModules, jsx, lib (+12 more)

### Community 8 - "Email Notification Pipeline"
Cohesion: 0.22
Nodes (15): @payloadcms/email-nodemailer, emailAdapter, FROM_ADDRESS, FROM_NAME, notifyRecipients(), smtpConfigured, customerEmail(), dispatcherEmail() (+7 more)

### Community 9 - "Site Layout, Header & Footer"
Cohesion: 0.15
Nodes (14): react, caveat, generateMetadata(), inter, RootLayout(), sora, Column, Footer() (+6 more)

### Community 10 - "Location & Service-Combo Pages"
Cohesion: 0.24
Nodes (14): generateMetadata(), generateStaticParams(), LocationPage(), ComboPage(), generateMetadata(), generateStaticParams(), load(), getLocation (+6 more)

### Community 11 - "Enquiry API & Rate Limiting"
Cohesion: 0.19
Nodes (13): clean(), looksLikePhone(), MAX, POST(), TYPES, buckets, clientKey(), Hit (+5 more)

### Community 12 - "Reviews & Structured Data"
Cohesion: 0.17
Nodes (12): metadata, ReviewsPage(), ReviewCard(), JsonLd(), localBusinessSchema(), ratingBlock(), reviewSchema(), SITE_URL (+4 more)

### Community 13 - "Seed Data & Rich Text"
Cohesion: 0.25
Nodes (13): doc(), heading(), LexNode, list(), para(), textNode(), FAQS, LOCATIONS (+5 more)

### Community 14 - "FAQ & Pricing Pages"
Cohesion: 0.23
Nodes (11): FaqPage(), metadata, metadata, PricingPage(), generateMetadata(), generateStaticParams(), FaqList(), getAllFaqs (+3 more)

### Community 15 - "NPM Scripts"
Cohesion: 0.14
Nodes (14): scripts, backup, build, dev, devsafe, email:check, generate:importmap, generate:types (+6 more)

### Community 16 - "CMS Data Fetch Layer"
Cohesion: 0.36
Nodes (12): HomePage(), ServicePage(), sitemap(), client(), getComboPairs, getComboTemplate, getHomePage, getLocations (+4 more)

### Community 17 - "Database Backup Script"
Cohesion: 0.25
Nodes (8): dbFile, dest, keep, mb(), mediaPath, root, run(), stamp

### Community 18 - "Payload REST API Route"
Cohesion: 0.29
Nodes (6): DELETE, GET, OPTIONS, PATCH, POST, PUT

### Community 19 - "App Icon & Branding"
Cohesion: 0.50
Nodes (5): App Icon (Padlock Favicon), Next.js App Router icon.svg File Convention, Orange Brand Color #ea580c, Closed Padlock Glyph, Security / Privacy Branding Theme

### Community 20 - "Next.js Config"
Cohesion: 0.50
Nodes (3): dirname, __filename, nextConfig

## Ambiguous Edges - Review These
- `App Icon (Padlock Favicon)` → `Security / Privacy Branding Theme`  [AMBIGUOUS]
  src/app/icon.svg · relation: rationale_for

## Knowledge Gaps
- **162 isolated node(s):** `__filename`, `dirname`, `nextConfig`, `name`, `version` (+157 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 177 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `App Icon (Padlock Favicon)` and `Security / Privacy Branding Theme`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **Why does `payload` connect `Payload Collections & Access Control` to `Package Dependencies`, `Admin Dashboard & Payload UI`, `Email Notification Pipeline`, `Enquiry API & Rate Limiting`, `Seed Data & Rich Text`, `CMS Data Fetch Layer`?**
  _High betweenness centrality (0.165) - this node is a cross-community bridge._
- **Why does `next` connect `Booking & Contact Pages` to `Package Dependencies`, `Admin Dashboard & Payload UI`, `Content Blocks & Icons`, `Site Layout, Header & Footer`, `Location & Service-Combo Pages`, `Reviews & Structured Data`, `FAQ & Pricing Pages`, `CMS Data Fetch Layer`, `Next.js Config`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `scripts` connect `NPM Scripts` to `Package Dependencies`?**
  _High betweenness centrality (0.048) - this node is a cross-community bridge._
- **What connects `__filename`, `dirname`, `nextConfig` to the rest of the system?**
  _162 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Payload Collections & Access Control` be split into smaller, more focused modules?**
  _Cohesion score 0.11594202898550725 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._