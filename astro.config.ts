import { defineConfig } from 'astro/config'
import webmanifest from 'astro-webmanifest'
import { getData } from './src/utils/getData'

export default defineConfig({
  site: 'https://photo.vitordino.com',
  trailingSlash: 'ignore',
  integrations: [
    {
      name: 'get-meta',
      hooks: {
        'astro:config:setup': async ({ config }) => {
          const data = await getData()
          config.integrations = [
            ...config.integrations,
            webmanifest({
              name: data?.meta?.title || '',
              icon: 'public/favicon.svg',
              short_name: data?.meta?.title || '',
              description: data?.meta?.description || '',
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
