import {Pool} from 'pg'
import {
  PGDATABASE,
  PGHOST,
  PGPASSWORD,
  PGPORT,
  PGUSER,
} from '../../config/'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'

const query = db => db.query

export const flQuery = S.pipe ([query, F.encaseP])

const pool = new Pool ({
  user: PGUSER,
  host: PGHOST,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
})

export const pgFlQuery = flQuery (pool)
