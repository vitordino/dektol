import 'dotenv/config'
import fetch from 'node-fetch'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { oraPromise as loader } from 'ora'

const { PRISMIC_REPO, PRISMIC_TYPES_TOKEN } = process.env

type CustomType = {
  id: string
  label: string
  repeatable: boolean
  json: Record<string, unknown>
  status: boolean
}

const s = (object: unknown) => JSON.stringify(object, null, 2)
const jsonPath = (fileName: string) => join('custom_types', `${fileName}.json`)

if (!PRISMIC_REPO) {
  throw new Error('no PRISMIC_REPO on .env')
}
if (!PRISMIC_TYPES_TOKEN) {
  throw new Error('no PRISMIC_TYPES_TOKEN on .env')
}

const headers = {
  repository: PRISMIC_REPO,
  Authorization: `Bearer ${PRISMIC_TYPES_TOKEN}`,
}

export default (async () => {
  const x = await loader(fetch('https://customtypes.prismic.io/customtypes', { headers }), {
    text: 'pulling custom types',
  })
  const allCustomTypes = (await loader(x.json(), { text: 'decoding' })) as CustomType[]

  const indexFileContent = allCustomTypes
    .filter(({ status }) => status)
    .map(({ id, label, repeatable }) => ({
      id,
      name: id,
      label,
      repeatable,
      value: `${id}.json`,
    }))

  await loader(writeFile(jsonPath('index'), s(indexFileContent)), {
    text: 'writing index file',
  })

  allCustomTypes.forEach(async ({ id, json }) => {
    console.log(`writing ${id}.json`)
    await loader(writeFile(jsonPath(id), s(json)), { text: `writing ${id}.json` })
    console.log(`wrote ${id}.json`)
  })
})()
