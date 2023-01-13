import {format} from 'node-pg-format'
import {pgFlQuery} from '../db/instance'
import {S} from '../lib/sanctuary'
import {sameValues} from '../lib/utils/getter'
import Sales from '../models/Sales'

// String -> Future Error Sales
export const findOneSalesByTelegramId = S.pipe ([
  (telegramId) =>
    pgFlQuery ({
      name: 'select one sales by telegram id',
      text: 'SELECT id FROM sales WHERE telegram_id=$1',
      values: [telegramId],
    }),
  S.map (S.prop ('rows')),
  S.map (S.head),
  S.map (S.fromMaybe ({})),
])

// String -> Future Error Sales
export const findOneSalesById = S.pipe ([
  (salesId) =>
    pgFlQuery ({
      name: 'select one sales by sales id',
      text: 'SELECT id::text, name::text FROM sales WHERE id=$1',
      values: [salesId],
    }),
  S.map (S.prop ('rows')),
  S.map (S.head),
  S.map (S.fromMaybe ({})),
])

// Array StrMap String -> Future Error Array Sales
export const insertManyToSales = (data) =>
  sameValues (S.keys (data)) (Sales)
    ? S.pipe ([
        (x) =>
          pgFlQuery ({
            name: 'Insert many record to sales table',
            text: format (
              'INSERT INTO sales (%I) VALUES %L RETURNING *',
              S.keys (x),
              S.values (x),
            ),
          }),
        S.map (S.prop ('rows')),
      ]) (data)
    : F.reject ('Wrong query columns')
