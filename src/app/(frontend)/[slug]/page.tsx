import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PageHero } from '../../../components/Hero'
import { Prose, CtaBanner } from '../../../components/blocks'
import { getPage, getPages, getSiteSettings } from '../../../lib/data'
import { JsonLd, breadcrumbSchema } from '../../../lib/schema'

export const generateStaticParams = async () => {
  const pages = await getPages()
  return pages.map((p) => ({ slug: p.slug! }))
}

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> => {
  const { slug } = await props.params
  const page = await getPage(slug)
  if (!page) return {}
  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.intro || undefined,
    alternates: { canonical: `/${page.slug}` },
    robots: page.seo?.noindex ? { index: false, follow: true } : undefined,
  }
}

const CmsPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params
  const [page, settings] = await Promise.all([getPage(slug), getSiteSettings()])
  if (!page) notFound()

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { label: 'Home', href: '/' },
          { label: page.title, href: `/${page.slug}` },
        ])}
      />

      <PageHero
        title={page.title}
        intro={page.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: page.title }]}
      />

      <section className="sec">
        <div className="wrap narrow">
          <Prose data={page.body} />
        </div>
      </section>

      {page.showCta ? <CtaBanner phone={settings.phone} phoneHref={settings.phoneHref} /> : null}
    </>
  )
}

export default CmsPage
