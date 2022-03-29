import * as prismic from '@prismicio/client'
import { LinkResolverFunction } from '@prismicio/helpers'

import sm from '../sm.json'

export const endpoint = sm.apiEndpoint
export const repositoryName = prismic.getRepositoryName(endpoint)

// Update the Link Resolver to match your project's route structure
export const linkResolver: LinkResolverFunction = doc => {
  switch (doc.type) {
    case 'homepage':
      return '/'
    case 'page':
    default:
      return `/${doc.uid || ''}`
  }
}

export const createClient = (config: prismic.ClientConfig = {}) => {
  const client = prismic.createClient(endpoint, config)
  return client
}
