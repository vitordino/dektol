import * as prismic from '@prismicio/client'
import type { LinkResolverFunction } from '@prismicio/helpers'
import config from '../.prismic.json'

// @ts-expect-error
const ENV_ENDPOINT = import.meta.env.PUBLIC_PRISMIC_ENDPOINT
const CONFIG_ENDPOINT = config.apiEndpoint
export const endpoint = ENV_ENDPOINT || CONFIG_ENDPOINT
export const repositoryName = prismic.getRepositoryName(endpoint)
console.log({ ENV_ENDPOINT, CONFIG_ENDPOINT, endpoint, repositoryName })

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
