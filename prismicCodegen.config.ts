import 'dotenv/config'
import type { Config } from 'prismic-ts-codegen'

const config: Config = {
  repositoryName: process.env.PRISMIC_REPO,
  accessToken: process.env.PRISMIC_TOKEN,
  customTypesAPIToken: process.env.PRISMIC_TYPES_TOKEN,
  locales: { fetchFromRepository: true },
  models: { fetchFromRepository: true },
  output: './src/prismic.generated.ts',
}

export default config
