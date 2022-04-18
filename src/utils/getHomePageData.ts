import memoize from 'p-memoize'
import * as prismic from '@prismicio/client'
import { gql } from 'graphql-request'
import type { HomePage } from '~/types'
import { createClient, repositoryName } from '~/prismic'

const client = createClient()

const homePageQuery = gql`
  {
    allPages {
      edges {
        node {
          _meta {
            uid
          }
          background
          foreground
          body {
            __typename
            ... on PageBodyHorizontal {
              type
              primary {
                background
                foreground
              }
              fields {
                image
              }
            }
          }
        }
      }
    }
  }
`

const endpoint = prismic.getGraphQLEndpoint(repositoryName)
const url = `${endpoint}?query=${homePageQuery}`

const getHomePageData = async () => {
  const response = await client.graphQLFetch(url, { method: 'GET' })
  const body = (await response.json()) as { data: HomePage }
  console.log(body)
  return body.data.allPages.edges.map(({ node }) => node)
}

export default memoize(getHomePageData)
