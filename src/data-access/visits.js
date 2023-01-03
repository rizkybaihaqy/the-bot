import {format} from 'node-pg-format'
import {pgFlQuery} from '../db/instance'
import Visit from '../models/Visit'

// Array String -> Future Error pg.Result
export const insertOneToVisits = (data) =>
  pgFlQuery ({
    name: 'Insert one record to visits table',
    text: format (
      'INSERT INTO visits (%I) VALUES (%L) RETURNING *',
      Visit,
      data,
    ),
  })

// Array Array String -> Future Error pg.Result
export const insertManyToVisits = (data) =>
  pgFlQuery ({
    name: 'Insert many record to visits table',
    text: format (
      'INSERT INTO visits (%I) VALUES %L RETURNING *',
      Visit,
      data,
    ),
  })
