import * as dotenv from 'dotenv'

// eslint-disable-next-line functional/no-expression-statement
dotenv.config ()

export const TOKEN = process.env.TOKEN
export const SERVER_URL = process.env.SERVER_URL
export const TRACKER_API_KEY = process.env.TRACKER_API_KEY
export const ADMIN_TELEGRAM_ID =
  process.env.ADMIN_TELEGRAM_ID
export const DETA_KEY = process.env.DETA_KEY
export const DETA_URL = process.env.DETA_URL
export const DB_CHOICE = process.env.DB_CHOICE
export const DATABASE_URL = process.env.DATABASE_URL
export const PGUSER = process.env.PGUSER
export const PGHOST = process.env.PGHOST
export const PGPASSWORD = process.env.PGPASSWORD
export const PGDATABASE = process.env.PGDATABASE
export const PGPORT = process.env.PGPORT
