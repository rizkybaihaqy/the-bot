import {format} from 'node-pg-format'
import {pgFlQuery} from '../db/instance'
import {S} from '../lib/sanctuary'
import {sameValues} from '../lib/utils/getter'
import Visit from '../models/Visit'

// StrMap String -> Future Error Visit
export const insertOneToVisits = (data) =>
  sameValues (S.keys (data)) (Visit)
    ? S.pipe ([
        (x) =>
          pgFlQuery ({
            name: 'Insert one record to visits table',
            text: format (
              'INSERT INTO visits (%I) VALUES (%L) RETURNING *',
              S.keys (x),
              S.values (x),
            ),
          }),
        S.map (S.prop ('rows')),
        S.map (S.head),
        S.map (S.fromMaybe ({})),
      ]) (data)
    : F.reject ('Wrong query columns')

// Array StrMap String -> Future Error Array Visit
export const insertManyToVisits = (data) =>
  S.all ((x) => sameValues (Visit) (S.keys (x))) (data)
    ? S.pipe ([
        (x) =>
          pgFlQuery ({
            name: 'Insert many record to visits table',
            text: format (
              'INSERT INTO visits (%I) VALUES %L RETURNING *',
              Visit,
              S.reduce ((b) => (a) => [ ...b, S.values (a) ]) (
                [],
              ) (x),
            ),
          }),
        S.map (S.prop ('rows')),
      ]) (data)
    : F.reject ('Wrong query columns Visit')

// String -> Future Error Array Visit
export const findAllTodayVisits = S.pipe ([
  (date) =>
    pgFlQuery ({
      name: 'Get visits data by created at',
      text: "SELECT * FROM visits WHERE created_at > date($1) - interval '1 day'",
      values: [date],
    }),
  S.map (S.prop ('rows')),
])
