import memoize from 'p-memoize'

import type { PageDocument } from '~/prismic.generated'
import { createClient } from '~/prismic'

const client = createClient()

const getHomePageData = () => client.getAllByType<PageDocument>('page')

export default memoize(getHomePageData)
