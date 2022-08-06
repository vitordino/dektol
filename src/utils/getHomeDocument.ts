import memoize from 'p-memoize'

import type { HomeDocument } from '~/prismic.generated'
import { createClient } from '~/prismic'

const client = createClient()

type GetHomeDocument = () => Promise<HomeDocument['data'] | null>

const getHomeDocument: GetHomeDocument = async () => {
  const { results } = await client.getByType<HomeDocument>('home')
  return results?.[0]?.data ?? null
}

export default memoize(getHomeDocument)
