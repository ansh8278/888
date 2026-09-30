import { getPayload } from 'payload'
import config from '@payload-config'
const payload = await getPayload({ config })
await payload.updateGlobal({
  slug: 'home-page',
  data: {
    headingLine1: 'Serving San Jose, the Bay Area',
    headingLine2: '& Arizona',
    lede: 'Automotive, residential, commercial and emergency locksmith services, dispatched to you across the Bay Area and the Phoenix metro area.',
  },
})
await payload.updateGlobal({ slug: 'site-settings', data: { serviceAreaLine: 'Serving San Jose, the Bay Area & Arizona' } })
const nav: any = await payload.findGlobal({ slug: 'navigation', depth: 0 })
await payload.updateGlobal({
  slug: 'navigation',
  data: { footerNote: 'Mobile locksmith serving San Jose, the San Francisco Bay Area and the Phoenix metro area.', header: nav.header, footerColumns: nav.footerColumns },
})
console.log('HEADLINE UPDATED')
process.exit(0)
