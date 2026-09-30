import type { Metadata } from 'next'
import { AreaHub } from '../../../components/AreaHub'
import { SERVICE_AREAS, getSiteSettings, getPageCopy } from '../../../lib/data'
import { absolute } from '../../../lib/schema'

const AREA = SERVICE_AREAS.find((a) => a.key === 'bay-area')!
const HUB_TITLE = 'Mobile Locksmith Serving San Jose & the Entire Bay Area'

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()
  return {
    // The client's exact title; description adds Tri-Valley to the client's meta (their own city list includes it — KI-2).
    title: { absolute: `Bay Area Locksmith | Mobile Locksmith Serving San Jose & the Bay Area | ${settings.companyName}` },
    description: `${settings.companyName} provides mobile locksmith services throughout San Jose and the Bay Area — South Bay, Peninsula, East Bay & Tri-Valley.`,
    alternates: { canonical: absolute('/bay-area-locksmith') },
  }
}

const BayAreaPage = async () => {
  const copy = await getPageCopy()
  return <AreaHub area={AREA} title={copy.locations?.title ?? HUB_TITLE} intro={copy.locations?.intro} eyebrow={copy.locations?.eyebrow} />
}

export default BayAreaPage
