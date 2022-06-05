import memoize from 'p-memoize'

import type { PageDocument } from '~/prismic.generated'
import { createClient } from '~/prismic'

const client = createClient()

const getAllPageDocuments = () => client.getAllByType<PageDocument>('page')

export default memoize(getAllPageDocuments)
