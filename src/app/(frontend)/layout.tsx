import type { Metadata } from 'next'
import { Inter, Sora, Caveat } from 'next/font/google'
import { Header, type NavItem } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { StickyCall } from '../../components/StickyCall'
import { getNavigation, getSiteSettings } from '../../lib/data'
import { mediaUrl } from '../../components/blocks'
import { ProgressBar } from '../../components/ProgressBar'
import '../../styles/site.css'

// Revalidate every 60s so pages are cached at the Edge CDN for instant (0ms)
// navigation while content edits in Payload CMS still update automatically.
export const revalidate = 60

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-sora', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-caveat', display: 'swap' })

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()
  const name = settings.companyName ?? '888 Lock & Key'
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: `${name} — 24/7 Mobile Locksmith`,
      template: `%s | ${name}`,
    },
    description:
      'Licensed, insured mobile locksmith for cars, homes and businesses. 24/7 emergency service with upfront pricing.',
    openGraph: {
      type: 'website',
      siteName: name,
      images: mediaUrl(settings.defaultSeoImage) ?? undefined,
    },
  }
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const [settings, nav] = await Promise.all([getSiteSettings(), getNavigation()])

  const headerItems: NavItem[] = (nav.header ?? []).map((i) => ({ label: i.label, href: i.href }))
  const footerColumns = (nav.footerColumns ?? []).map((c) => ({
    heading: c.heading,
    links: c.links ?? [],
  }))

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${caveat.variable}`}>
      <body>
        <ProgressBar />
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <Header
          companyName={settings.companyName ?? '888 Lock & Key'}
          tagline={settings.tagline}
          phone={settings.phone}
          phoneHref={settings.phoneHref}
          items={headerItems}
        />

        <main id="main">{children}</main>

        <Footer
          companyName={settings.companyName ?? '888 Lock & Key'}
          tagline={settings.tagline}
          phone={settings.phone}
          phoneHref={settings.phoneHref}
          email={settings.email}
          licenseNumber={settings.licenseNumber}
          serviceAreaLine={settings.serviceAreaLine}
          note={nav.footerNote}
          columns={footerColumns}
        />

        {/* Always-reachable call button on phones. Hides itself whenever a real
            call button is on screen, so the two are never shown together. */}
        <StickyCall phone={settings.phone} phoneHref={settings.phoneHref} />
      </body>
    </html>
  )
}

export default RootLayout
