import type { Metadata } from 'next'
import { PageHero } from '../../../components/Hero'
import { ReviewCard, CtaBanner } from '../../../components/blocks'
import { getReviews, getSiteSettings } from '../../../lib/data'
import { JsonLd, breadcrumbSchema, reviewSchema } from '../../../lib/schema'

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: 'Real reviews from customers across California, Arizona and New York.',
  alternates: { canonical: '/reviews' },
}

const ReviewsPage = async () => {
  const [reviews, settings] = await Promise.all([getReviews(), getSiteSettings()])

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ label: 'Home', href: '/' }, { label: 'Reviews', href: '/reviews' }])} />
      <JsonLd data={reviewSchema(settings, reviews)} />

      <PageHero
        eyebrow={`${settings.rating} · ${settings.reviewCount}+ reviews`}
        title="What our customers say"
        intro="Real people, real jobs, in their own words."
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

      <CtaBanner phone={settings.phone} phoneHref={settings.phoneHref} />
    </>
  )
}

export default ReviewsPage
