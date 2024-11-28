import memoize from 'p-memoize'

import type { PageDocument } from 'src/prismic.generated'
import { createClient } from 'src/prismic'

const client = createClient()

const getAllPageDocuments = () => client.getAllByType<PageDocument>('page')

export default memoize(getAllPageDocuments)
