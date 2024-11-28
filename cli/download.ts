import Bun from 'bun'
import { join } from 'node:path'
import pages from './data.json'

const x = pages.map(({ uid, data }) => ({
  folder: uid,
  images: data?.page?.body?.value?.flatMap(({ repeat }) =>
    repeat.map(x => ({
      url: x.image.value.main.url,
      filename: decodeURIComponent(
        x.image.value.main.url
          .replace('https://images.prismic.io/photo-vitordino/', '')
          .slice(37)
          .replace(/\.[^.]*$/, '')
          .replaceAll('_+', ', ')
          .replaceAll('+', ' '),
      ),
    })),
  ),
}))

x.forEach(async ({ folder, images }) => {
  console.log('-'.repeat(80))
  console.log({ folder, count: images.length })
  images.forEach(async ({ url, filename }) => {
    const path = join(folder, `${filename}.jpg`)
    console.log(path)
    const res = await fetch(url)
    const data = await res.blob()
    Bun.write(path, data)
  })
})
