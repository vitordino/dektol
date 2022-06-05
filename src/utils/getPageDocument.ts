import memoize from 'p-memoize'

import type { PageDocument } from '~/prismic.generated'
import { createClient } from '~/prismic'

const client = createClient()

const getPageDocument = (id: string | number) =>
  client.getByUID<PageDocument>('page', id.toString())

export default memoize(getPageDocument)
