import type { Metadata } from 'next'
import { Inter, Sora, Caveat } from 'next/font/google'
import { Header, type NavItem } from '../../components/Header'
import { Footer } from '../../components/Footer'
import { StickyCall } from '../../components/StickyCall'
import { getNavigation, getSiteSettings } from '../../lib/data'
import { mediaUrl } from '../../components/blocks'
import { ProgressBar } from '../../components/ProgressBar'
import { phoneOf } from '../../lib/contact'
import '../../styles/site.css'

// Dynamic rendering and 0-second revalidation ensure all edits in Payload CMS
// reflect instantly on the live site.
export const dynamic = 'force-dynamic'
export const revalidate = 0

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const sora = Sora({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-sora', display: 'swap' })
const caveat = Caveat({ subsets: ['latin'], weight: ['600', '700'], variable: '--font-caveat', display: 'swap' })

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()
  const name = settings.companyName ?? '888 Lock & Key'
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
    title: {
      default: `Mobile Locksmith Serving San Jose & the Entire Bay Area | ${name}`,
      template: `%s | ${name}`,
    },
    description:
      'Licensed mobile locksmith serving San Jose and the entire San Francisco Bay Area — automotive, residential, commercial & emergency locksmith services.',
    openGraph: {
      type: 'website',
      siteName: name,
      images: mediaUrl(settings.defaultSeoImage) ?? undefined,
    },
  }
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const [settings, nav] = await Promise.all([getSiteSettings(), getNavigation()])
  const phone = phoneOf(settings)

  const headerItems: NavItem[] = (nav.header ?? []).map((i) => ({ label: i.label, href: i.href }))
  const footerColumns = (nav.footerColumns ?? []).map((c) => ({
    heading: c.heading,
    links: c.links ?? [],
  }))

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${caveat.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ProgressBar />
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <Header
          companyName={settings.companyName ?? '888 Lock & Key'}
          tagline={settings.tagline}
          phone={phone}
          items={headerItems}
        />

        <main id="main">{children}</main>

        <Footer
          companyName={settings.companyName ?? '888 Lock & Key'}
          tagline={settings.tagline}
          phone={phone}
          email={settings.email}
          licenseNumber={settings.licenseNumber}
          serviceAreaLine={settings.serviceAreaLine}
          hours={settings.hours}
          note={nav.footerNote}
          columns={footerColumns}
        />

        {/* Always-reachable Call / Request bar on phones. */}
        <StickyCall phone={phone} />
      </body>
    </html>
  )
}

export default RootLayout
