import {Pool} from 'pg'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'

require ('dotenv').config ()

const query = (db) => (text, params, callback) =>
  db.query (text, params, callback)

export const flQuery = (db) =>
  S.pipe ([ query, F.encaseP ]) (db)

const pool = new Pool ()

export const pgFlQuery = flQuery (pool)
