import {Pool} from 'pg'
import { flQuery } from '.'

require ('dotenv').config ()

const pool = new Pool ()

export const pgFlQuery = flQuery (pool)
