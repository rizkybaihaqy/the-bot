import {flDetaBase} from '../../db/deta-base'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sameValues} from '../../lib/utils/getter'
import Sales from '../../models/Sales'

// String -> Future Error Sales
export const findOneSalesByTelegramId = (telegramId) =>
  flDetaBase ('sales') ('fetch') ({telegram_id: telegramId})

// String -> Future Error Sales
export const findOneSalesById = (salesId) =>
  flDetaBase ('sales') ('fetch') ({key: salesId})

// StrMap String -> Future Error Array Sales
export const insertManyToSales = (data) =>
  S.all ((x) => sameValues (Sales) (S.keys (x))) (data)
    ? flDetaBase ('sales') ('putMany') (data)
    : F.reject ('Wrong query columns Sales')
