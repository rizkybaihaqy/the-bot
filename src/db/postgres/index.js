import {Pool} from 'pg'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'

require ('dotenv').config ()

const query = db => db.query

export const flQuery = S.pipe ([query, F.encaseP])

const pool = new Pool ()

export const pgFlQuery = flQuery (pool)
