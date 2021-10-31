import { config } from 'dotenv-cra'
import { envParseString } from './env'

// Unless explicitly defined, set NODE_ENV as development:
process.env.NODE_ENV ??= 'development'

config()

export const app = {
  token: envParseString('TOKEN')
}
