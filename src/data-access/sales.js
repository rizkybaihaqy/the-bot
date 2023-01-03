import {format} from 'node-pg-format'
import {pgFlQuery} from '../db/instance'
import Sales from '../models/Sales'

// String -> Future Error pg.Result
export const getSalesByTelegramId = (telegramId) =>
  pgFlQuery ({
    name: 'select one sales by telegram id',
    text: 'SELECT id FROM sales WHERE telegram_id=$1',
    values: [telegramId],
  })

// Array Array String -> Future Error pg.Result
export const insertManyToSales = (data) =>
  pgFlQuery ({
    name: 'Insert many record to sales table',
    text: format (
      'INSERT INTO sales (%I) VALUES %L RETURNING *',
      Sales,
      data,
    ),
  })
