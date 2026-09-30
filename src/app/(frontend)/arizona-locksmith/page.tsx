import type { Metadata } from 'next'
import { AreaHub } from '../../../components/AreaHub'
import { SERVICE_AREAS, getSiteSettings } from '../../../lib/data'
import { absolute } from '../../../lib/schema'

const AREA = SERVICE_AREAS.find((a) => a.key === 'arizona')!
const TITLE = 'Mobile Locksmith Serving the Phoenix Metro Area'
const INTRO =
  '888 Lock & Key dispatches mobile automotive, residential, commercial and emergency locksmith technicians across the Phoenix metro area. Find your city below.'

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getSiteSettings()
  return {
    title: { absolute: `Arizona Locksmith | ${TITLE} | ${settings.companyName}` },
    description: `${settings.companyName} provides mobile locksmith services across the Phoenix metro area — Phoenix, Scottsdale, Tempe, Mesa, Chandler, Gilbert, Glendale & Peoria.`,
    alternates: { canonical: absolute('/arizona-locksmith') },
  }
}

const ArizonaPage = () => <AreaHub area={AREA} title={TITLE} intro={INTRO} />

export default ArizonaPage
