import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { ReviewCard, CtaBanner } from '../../../components/blocks'
import { getReviews, getSiteSettings, getPageCopy } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, reviewSchema, absolute } from '../../../lib/schema'
import { phoneOf } from '../../../lib/contact'

export const generateMetadata = async (): Promise<Metadata> => {
  const copy = await getPageCopy()
  return {
    title: copy.reviews?.title ?? 'Customer Reviews',
    description: copy.reviews?.intro ?? undefined,
    alternates: { canonical: absolute('/reviews') },
  }
}

const ReviewsPage = async () => {
  const [reviews, settings, copy] = await Promise.all([getReviews(), getSiteSettings(), getPageCopy()])

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews' }])} />
      <JsonLd data={reviewSchema(settings, reviews)} />

      <PageHero
        eyebrow={copy.reviews?.eyebrow || (settings.rating && settings.reviewCount ? `${settings.rating} · ${settings.reviewCount}+ reviews` : 'Reviews')}
        title={copy.reviews?.title ?? 'What our customers say'}
        intro={copy.reviews?.intro}
        crumbs={[{ label: 'Home', href: '/' }, { label: 'Reviews' }]}
      />

      <section className="sec">
        <div className="wrap">
          {reviews.length > 0 ? (
            <div className="review-static-grid">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          ) : (
            // Honest empty state until verified reviews are entered in the admin (D6).
            <div className="empty-state">
              <h2>Reviews are on their way</h2>
              <p>We only publish verified customer reviews. Check back soon, or ask us for references when you call.</p>
            </div>
          )}
        </div>
      </section>

      <CtaBanner phone={phoneOf(settings)} heading={copy.ctaHeading} subtitle={copy.ctaSubtitle} />
    </>
  )
}

export default ReviewsPage
