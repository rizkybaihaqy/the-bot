import {encaseP} from 'fluture'
import {S} from '../lib/sanctuary/instance'

const query = (db) => (text, params, callback) =>
  db.query (text, params, callback)

export const flQuery = (db) => S.pipe ([ query, encaseP ]) (db)
