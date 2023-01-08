import {format} from 'node-pg-format'
import {pgFlQuery} from '../db/instance'
import {sameValues} from '../lib/utils/getter'
import Visit from '../models/Visit'

// Array String -> Array String -> Future Error pg.Result
export const insertOneToVisits = (cols) => (data) =>
  sameValues (cols) (Visit)
    ? pgFlQuery ({
        name: 'Insert one record to visits table',
        text: format (
          'INSERT INTO visits (%I) VALUES (%L) RETURNING *',
          cols,
          data,
        ),
      })
    : F.reject ('Wrong query columns')

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
