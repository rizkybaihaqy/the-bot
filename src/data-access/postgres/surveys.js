import {format} from 'node-pg-format'
import {pgFlQuery} from '../../db/postgres'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sameValues} from '../../lib/utils/getter'
import Survey from '../../models/Survey'

// StrMap String -> Future Error Survey
export const insertOneToSurveys = data =>
  sameValues (S.keys (data)) (Survey)
    ? S.pipe ([
        x =>
          pgFlQuery ({
            name: 'Insert one record to visits table',
            text: format (
              'INSERT INTO surveys (%I) VALUES (%L) RETURNING *',
              S.keys (x),
              S.values (x)
            ),
          }),
        S.map (S.prop ('rows')),
        S.map (S.head),
        S.map (S.fromMaybe ({})),
      ]) (data)
    : F.reject ('Wrong query columns')

// Array StrMap String -> Future Error Array Survey
export const insertManyToSurveys = data =>
  S.all (x => sameValues (Survey) (S.keys (x))) (data)
    ? S.pipe ([
        x =>
          pgFlQuery ({
            name: 'Insert many record to surveys table',
            text: format (
              'INSERT INTO surveys (%I) VALUES %L RETURNING *',
              Survey,
              S.reduce (b => a => [...b, S.values (a)]) (
                []
              ) (x)
            ),
          }),
        S.map (S.prop ('rows')),
      ]) (data)
    : F.reject ('Wrong query columns Survey')
