import memoize from 'p-memoize'

import type { PageDocument } from 'src/prismic.generated'
import { createClient } from 'src/prismic'

const client = createClient()

const getPageDocument = (id: string | number) =>
  client.getByUID<PageDocument>('page', id.toString())

export default memoize(getPageDocument)
