import 'dotenv/config'
import fetch from 'node-fetch'
import { execa } from 'execa'
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

if (!PRISMIC_REPO) {
  throw new Error('no PRISMIC_REPO on .env')
}
if (!PRISMIC_TYPES_TOKEN) {
  throw new Error('no PRISMIC_TYPES_TOKEN on .env')
}

const s = (object: unknown) => JSON.stringify(object, null, 2)
const jsonPath = (fileName: string) => join('custom_types', `${fileName}.json`)

const fetchAllCustomTypes = async () => {
  const headers = {
    repository: PRISMIC_REPO,
    Authorization: `Bearer ${PRISMIC_TYPES_TOKEN}`,
  }
  const response = await loader(fetch('https://customtypes.prismic.io/customtypes', { headers }), {
    text: 'pulling custom types',
  })
  return (await loader(response.json(), { text: 'decoding' })) as CustomType[]
}

const writeCustomTypeIndexFile = async (allCustomTypes: CustomType[]) => {
  const indexFileContent = allCustomTypes
    .filter(({ status }) => status)
    .map(({ id, label, repeatable }) => ({
      id,
      name: id,
      label,
      repeatable,
      value: `${id}.json`,
    }))

  return await loader(writeFile(jsonPath('index'), s(indexFileContent)), {
    text: 'writing index file',
  })
}

const writeCustomTypeFiles = async (allCustomTypes: CustomType[]) =>
  allCustomTypes.forEach(async ({ id, json }) => {
    await loader(writeFile(jsonPath(id), s(json)), { text: `writing ${id}.json` })
  })

const codegen = async () => {
  const { exitCode, stdout, stderr } = await loader(execa('prismic-ts-codegen'), {
    text: 'generating typescript definitions',
  })

  if (stdout) process.stdout.write(stdout)
  if (stderr) process.stderr.write(stderr)
  if (exitCode) process.exit(exitCode)
}

export default (async () => {
  const allCustomTypes = await fetchAllCustomTypes()
  await writeCustomTypeIndexFile(allCustomTypes)
  await writeCustomTypeFiles(allCustomTypes)
  await codegen()
})()
