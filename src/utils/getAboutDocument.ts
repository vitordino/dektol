import memoize from 'p-memoize'

import type { AboutDocument } from '../prismic.generated'
import { createClient } from '../prismic'

const client = createClient()

type GetAboutDocument = () => Promise<(AboutDocument['data'] & { uid: string }) | null>

const getAboutDocument: GetAboutDocument = async () => {
  const { results } = await client.getByType<AboutDocument>('about')
  return { ...results?.[0]?.data, uid: results?.[0]?.uid } ?? null
}

export default memoize(getAboutDocument)
