import { revalidatePath } from 'next/cache'

/**
 * On-demand revalidation hook for Payload CMS.
 * Whenever any document or global is created, edited, or deleted in the admin portal,
 * this purges the Next.js cache for the entire frontend layout, ensuring changes
 * reflect instantly on the live site.
 */
export const revalidateSite = (args?: any) => {
  try {
    revalidatePath('/', 'layout')
  } catch (_e) {
    // In some non-request contexts (like build or seed scripts),
    // next/cache may not be available. Ignore safely.
  }
  return args?.doc
}
