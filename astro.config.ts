import { defineConfig } from 'astro/config'
import webmanifest from 'astro-webmanifest'
// @ts-ignore-next-line
import getHomeDocument from './src/utils/getHomeDocument.ts'

export default defineConfig({
  site: 'https://photo.vitordino.com',
  trailingSlash: 'ignore',
  integrations: [
    {
      name: 'get-meta',
      hooks: {
        'astro:config:setup': async ({ config }) => {
          const homeData = await getHomeDocument()
          config.integrations = [
            ...config.integrations,
            webmanifest({
              name: homeData?.meta_title || '',
              icon: 'public/favicon.svg',
              short_name: homeData?.meta_title || '',
              description: homeData?.meta_description || '',
              start_url: '/',
              theme_color: '#fff',
              background_color: '#151718',
              display: 'standalone',
            }),
          ]
        },
      },
    },
  ],
})
