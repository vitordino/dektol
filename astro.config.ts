import { defineConfig } from 'astro/config'
import webmanifest from 'astro-webmanifest'
import { getData } from './src/utils/getData'
import { rmdir, mkdir, writeFile } from 'fs/promises'
import { dirname, join } from 'path'

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
    {
      name: 'download-images',
      hooks: {
        'astro:config:setup': async () => {
          const data = await getData()
          const images = data?.children
            ?.flatMap(x => x?.children?.flatMap(x => x.children))
            ?.map(({ path }) => path)
          const sectionFolders = [...new Set(images.map(x => dirname(join('public', x))))]
          const pageFolders = [...new Set(sectionFolders.map(x => dirname(x)))]

          // delete existing content from previous builds
          for await (let folder of pageFolders) {
            await rmdir(folder, { recursive: true }).catch(x => {})
          }

          // create page/section folders again
          for await (let folder of sectionFolders) {
            await mkdir(folder, { recursive: true })
          }

          // [parallel] download images from api to public folder
          await Promise.allSettled(
            images.map(async path => {
              if (!path) return
              const filename = join('public', path)
              // [TODO]: flexible base url
              const body = await fetch(`http://localhost:3001/${path}?h=1400&q=50`)
              const buffer = await body.arrayBuffer()

              await writeFile(filename, Buffer.from(buffer), {})
              console.log('[download-images]: ', path)
              return Promise.resolve(path)
            }),
          )
        },
      },
    },
  ],
})
