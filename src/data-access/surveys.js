import {format} from 'node-pg-format'
import {pgFlQuery} from '../db/instance'
import Survey from '../models/Survey'

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
