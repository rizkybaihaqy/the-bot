import {format} from 'node-pg-format'
import {pgFlQuery} from '../db/instance'
import Survey from '../models/Survey'

// Array String -> Array String -> Future Error pg.Result
export const insertOneToSurveys = (cols) => (data) =>
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
export const insertManyToSurveys = (data) =>
  pgFlQuery ({
    name: 'Insert many record to surveys table',
    text: format (
      'INSERT INTO surveys (%I) VALUES %L RETURNING *',
      Survey,
      data,
    ),
  })
