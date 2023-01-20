import {
  findAllSales,
  findOneSalesByTelegramId,
  insertOneToSales,
} from '../data-access'
import {F} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {now} from '../lib/utils/getter'

// StrMap String -> Future String Survey
export const addSales = S.pipe ([
  sales =>
    F.both (F.resolve (sales)) (
      findOneSalesByTelegramId (sales.telegram_id)
    ),
  S.chain (([input, inDb]) =>
    inDb.sales_code === input.sales_code &&
    inDb.telegram_id === input.telegram_id
      ? F.reject (
          `Sales with this telegram account or with sales code:${input.sales_code} already exist`
        )
      : F.resolve (input)
  ),
  S.map (S.insert ('created_at') (now)),
  S.chain (insertOneToSales),
])

export const getAllSales = findAllSales
