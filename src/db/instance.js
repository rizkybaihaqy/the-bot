import {Pool} from 'pg'
import { query } from '.'

require ('dotenv').config ()

const pool = new Pool ()

export const dbQuery = query (pool)
