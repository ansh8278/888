import Script from 'next/script'

/**
 * Google Analytics, switched on only when the client has supplied a
 * measurement ID in Site settings. With no ID nothing is injected at all —
 * no third-party script, no cookie, no consent problem.
 */
export const Analytics = ({ id }: { id?: string | null }) => {
  const gaId = id?.trim()
  if (!gaId) return null
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${gaId}');`}
      </Script>
    </>
  )
}
