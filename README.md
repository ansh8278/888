# 888 Lock & Key — website + CMS

Next.js 16 (App Router, static) + Payload 3 CMS on SQLite. One app serves both
the public site and the admin at `/admin`.

## Running it

```bash
npm run dev      # http://localhost:3000  (site) and /admin (CMS)
npm run build    # production build — generates all 66 pages
npm start        # serve the production build
npm run seed     # wipe content and reload the starter content (keeps users)
```

**Admin login:** `admin@888lockandkey.com` / `ChangeMe123!`
Change this immediately — it is a known default. Do it in the CMS under
**Admin → Users**, or set `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` before seeding.

> If a port is already in use, Next silently starts on 3001 and you will be
> looking at a stale server. Check the port it prints.

## Environment

`.env` (not committed):

```
DATABASE_URI=file:./888.db
PAYLOAD_SECRET=<random 64 hex chars>       # openssl rand -hex 32
NEXT_PUBLIC_SITE_URL=https://yourdomain.com  # used by canonicals, sitemap, robots, JSON-LD
```

`NEXT_PUBLIC_SITE_URL` defaults to `http://localhost:3000`. **Set it before the
production build** or the sitemap and canonical URLs will point at localhost.

## Pages

| Route | Source |
|---|---|
| `/` | Home page global + Services/Locations/Reviews/FAQs |
| `/services`, `/services/[slug]` | Services collection |
| `/services/[slug]/[city]` | **36 combo pages** — every service × every city |
| `/locations`, `/locations/[slug]` | Locations collection |
| `/pricing`, `/reviews`, `/faq` | Generated from the collections |
| `/book`, `/contact` | Forms → Enquiries collection |
| `/thank-you` | Confirmation after a form is sent. `noindex`, and kept out of the sitemap, so it cannot rank or pollute analytics. Hook conversion tracking here. |
| `/about`, `/privacy`, `/terms`, `/<any>` | Pages collection — staff can add more |
| `/sitemap.xml`, `/robots.txt` | Generated, combo pages included |

Adding a service or a city in the CMS automatically creates its page **and** its
combo pages, and adds them to the sitemap and the internal links.

## The admin

Branded to match the site (orange palette, Sora/Inter, padlock mark) and the
default dashboard is replaced with a custom one:

- **New enquiries banner** at the top — the only time-critical thing in the CMS.
  Turns orange with a count, links straight to the unanswered ones, and lists
  the five most recent with name, service, city, phone and how long ago.
- **Tiles instead of a collection list** — grouped "Edit the website" and
  "Settings", each with a plain-English hint, so staff do not have to know
  Payload's vocabulary (collections vs globals).
- **Live stats** — services, cities, generated pages, reviews, pages live.
- **View live site** button, and a **Preview** button on every service,
  location and page that opens its real URL.
- **Log out** button, labelled with who is signed in. Payload's own log-out is
  an unlabelled icon in the sidebar corner, which staff could not find — it is
  now labelled there too.
- **Sidebar icons**, keyed off the `#nav-*` ids Payload puts on each item.
  Deliberately not baked into the labels: an emoji in a label leaks into page
  titles, breadcrumbs and the API. Note that href selectors do not work here —
  the item for the page you are currently on renders as a `<div>` with no href.
- **Enquiries sits at the top** of the sidebar, above Content, being the one
  thing staff open daily. Ordering follows the `collections` array in
  `src/payload.config.ts`.

### Deleting an enquiry

Two ways, both built in:

- **One at a time** — open the lead, then the `⋯` menu next to Save → *Delete*.
- **Several at once** — tick the rows in the Enquiries list, then *Delete* at
  the top right.

Any signed-in staff member can delete, and it is permanent — there is no
recycle bin. If that worries you, either restrict deletion to admins
(`delete: adminOnly` in `src/collections/Enquiries.ts`) or use the *Closed*
status instead of deleting, so the record is kept.

Files: `src/components/admin/Dashboard.tsx`, `Graphics.tsx`, and the theme in
`src/app/(payload)/custom.scss`. Both light and dark themes are supported.

## Email: lead alerts and password resets

Both run through one SMTP setup in `.env`:

```
NOTIFY_EMAIL=dispatch@yourdomain.com   # who gets told about new leads
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=...
SMTP_PASSWORD=...
SMTP_FROM=dispatch@yourdomain.com
```

Any SMTP provider works — Resend, Postmark, SendGrid, Fastmail, your host's
mailbox. **With SMTP unset, emails are rendered and logged instead of sent**, so
local development still works and nothing disappears silently.

- **New enquiry** → *two* emails. The dispatcher gets the customer's name,
  phone, service, city and message, a one-tap *Call* button and a link to the
  record. The customer gets a confirmation repeating what they asked for, the
  number we will ring, and the phone number in case they would rather call —
  but only if they filled in the optional email field. Sent on creation only,
  so status changes do not re-notify.

  The two sends are isolated: one failing cannot stop the other, and the
  customer is still confirmed even if `NOTIFY_EMAIL` is unset. The confirmation
  deliberately contains no admin link.
- **Forgot password** → a branded reset email. This is why the adapter matters:
  without it Payload writes the reset link to the server console and staff who
  forget their password are locked out.

The alert never blocks a submission. If the mail provider fails, the lead is
still saved and the failure is logged with the customer's details, so it can be
recovered from the log. With `NOTIFY_EMAIL` unset the same is true, with a
warning naming the customer and phone number.

> Still worth adding: **SMS**. Email alone will not wake anyone at 2am. Needs a
> Twilio (or similar) account; the notification hook is in `src/lib/notify.ts`
> and a second channel drops in beside the email call.

## Editing content

Everything on the site is editable at `/admin`:

- **Content** — Services, Locations, Reviews, FAQs, Pages
- **Pages** — Home page (every hero word), Service-in-city page template
- **Settings** — Site settings (phone, licence, hours, ratings), Menus
- **Enquiries** — form submissions, with a status workflow
- **Admin** — Users

### The combo-page template

The 36 service-in-city pages share one editable template
(**Pages → Service-in-city pages**) using placeholders: `{service}`, `{city}`,
`{state}`, `{phone}`, `{arrival}`, `{price}`. An unknown placeholder is left
visible rather than silently blanked, so typos are obvious. Untick *Generate
these pages* to remove all 36 from the site and sitemap at once.

## Roles

- **Admin** — everything, including creating users
- **Editor** — content only; cannot create users or change anyone's role
  (enforced at field level, so an editor cannot promote themselves)

## Content notes

Everything shipped is **placeholder**: `(408) 555-0888`, `BSIS #LCO-000000`, and
invented addresses. Replace under **Settings → Site settings** and **Locations**.
The phone number lives in one place and feeds the header, hero, every CTA, the
footer and the JSON-LD.

## Deploying

Needs a Node host with a persistent disk (SQLite file + uploaded media):
Railway, Render, Fly.io, or a VPS. Not Vercel/Cloudflare Pages as-is — their
filesystems are ephemeral, so the database and uploads would vanish on redeploy.

To move to Postgres later, swap `sqliteAdapter` for `postgresAdapter` in
`src/payload.config.ts`; the schema is generated either way.

Persist across deploys: `888.db` and `media/`.

## Structure

```
src/
  app/(frontend)/     public site
  app/(payload)/      CMS admin + REST/GraphQL (generated, do not edit)
  app/api/enquiry/    public form endpoint (validates, strips privileged fields)
  app/robots.ts       must stay at app root — inside a route group it 404s
  collections/        Services, Locations, Reviews, Faqs, Pages, Enquiries, Media, Users
  globals/            SiteSettings, Navigation, HomePage, ComboTemplate
  components/         Header, Footer, Hero, blocks, FaqList, Icon
  lib/                data access (React-cached), JSON-LD, template filler
  seed/               starter content
  styles/site.css     the original stylesheet, ported
```

## Tests

```bash
npm test    # combo-page placeholders, plus lead alerts and password reset
```

The email test stubs the transport, so it proves the messages are built and
sent without needing a mail provider. It also checks that customer input is
escaped, and that editing a lead does not re-notify the dispatcher.

## Notes for whoever picks this up

- Forms post to `/api/enquiry`, not straight to Payload, so the endpoint can
  validate and drop fields a customer must not set (`status`, `notes`).
  Enquiries are **not** publicly readable — they hold customer names and phones.
- Spam is handled by a hidden honeypot field, which answers `200` so bots do not
  learn they were caught. No captcha.
- The FAQ accordions are `<details>`/`<summary>`, so keyboard support and
  find-in-page work without JavaScript.
- The review marquee is two identical CSS tracks; it pauses on hover and focus
  and stops entirely under `prefers-reduced-motion`.
- The sticky phone button on mobile (`StickyCall.tsx`) hides itself whenever a
  real call button is on screen, so the two are never stacked together. Mark any
  new prominent call button with `data-call-cta` and it joins that behaviour;
  the header pill, footer link and inline numbers in address blocks are
  deliberately unmarked, being too small to replace it.
