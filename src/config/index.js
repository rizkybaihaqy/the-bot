import * as dotenv from 'dotenv'
import path from 'path'

// eslint-disable-next-line functional/no-expression-statement
dotenv.config ({
  path: path.resolve (
    process.cwd (),
    '.env.' + process.env.NODE_ENV
  ),
})

export default {
  TRACKER_API_KEY: process.env.TRACKER_API_KEY,

  DB_CHOICE: process.env.DB_CHOICE,
  SERVER_URL: process.env.SERVER_URL,
  TOKEN: process.env.TOKEN,
  ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID,

  // dev
  DATABASE_URL: process.env.DATABASE_URL,

  // testing & staging
  DETA_KEY: process.env.DETA_KEY,
  DETA_BASE: process.env.DETA_BASE,
}
