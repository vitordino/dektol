import * as prismic from '@prismicio/client'
import { LinkResolverFunction } from '@prismicio/helpers'

export const repositoryName = 'photo-vitordino'

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
  const client = prismic.createClient(repositoryName, config)
  return client
}
