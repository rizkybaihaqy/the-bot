import {format} from 'node-pg-format'
import {pgFlQuery} from '../../db/postgres'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sameValues} from '../../lib/utils/getter'
import Sales from '../../models/Sales'

// StrMap String -> Future Error Survey
export const insertOneToSales = data =>
  sameValues (S.keys (data)) (Sales)
    ? S.pipe ([
        x =>
          pgFlQuery ({
            name: 'Insert one record to sales table',
            text: format (
              'INSERT INTO sales (%I) VALUES (%L) RETURNING *',
              S.keys (x),
              S.values (x)
            ),
          }),
        S.map (S.prop ('rows')),
        S.map (S.head),
        S.map (S.fromMaybe ({})),
      ]) (data)
    : F.reject ('Wrong query columns @insertOneSales')

// Empty -> Future Error Array Sales
export const findAllSales = S.pipe ([
  _ =>
    pgFlQuery ({
      name: 'Get all sales data',
      text: 'SELECT * FROM sales',
    }),
  S.map (S.prop ('rows')),
])

// String -> Future Error Sales
export const findOneSalesByTelegramId = S.pipe ([
  telegramId =>
    pgFlQuery ({
      name: 'select one sales by telegram id',
      text: 'SELECT * FROM sales WHERE telegram_id=$1',
      values: [telegramId],
    }),
  S.map (S.prop ('rows')),
  S.map (S.head),
  S.map (S.fromMaybe ({})),
])

// String -> Future Error Sales
export const findOneSalesById = S.pipe ([
  salesId =>
    pgFlQuery ({
      name: 'select one sales by sales sales_code',
      text: 'SELECT sales_code::text, name::text FROM sales WHERE sales_code=$1',
      values: [salesId],
    }),
  S.map (S.prop ('rows')),
  S.map (S.head),
  S.map (S.fromMaybe ({})),
])

// Array StrMap String -> Future Error Array Sales
export const insertManyToSales = data =>
  S.all (x => sameValues (Sales) (S.keys (x))) (data)
    ? S.pipe ([
        x =>
          pgFlQuery ({
            name: 'Insert many record to sales table',
            text: format (
              'INSERT INTO sales (%I) VALUES %L RETURNING *',
              Sales,
              S.reduce (b => a => [...b, S.values (a)]) (
                []
              ) (x)
            ),
          }),
        S.map (S.prop ('rows')),
      ]) (data)
    : F.reject ('Wrong query columns Sales')
