import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { ReviewCard, CtaBanner } from '../../../components/blocks'
import { getReviews, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, reviewSchema } from '../../../lib/schema'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.reviews?.title ?? 'Customer Reviews',
    description: copy.reviews?.intro ?? undefined,
    alternates: { canonical: '/reviews' },
  }
}

const ReviewsPage = async () => {
  const [reviews, settings, copy] = await Promise.all([getReviews(), getSiteSettings(), getPageCopy()])

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews' }])} />
      <JsonLd data={reviewSchema(settings, reviews)} />

      <PageHero
        eyebrow={copy.reviews?.eyebrow || `${settings.rating} · ${settings.reviewCount}+ reviews`}
        title={copy.reviews?.title ?? 'What our customers say'}
        intro={copy.reviews?.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Reviews' }]}
      />

      <section className="sec">
        <div className="wrap">
          <div className="review-static-grid">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner phone={settings.phone} phoneHref={settings.phoneHref} heading={copy.ctaHeading} subtitle={copy.ctaSubtitle} />
    </>
  )
}

export default ReviewsPage
