import {flDetaBase} from '../../db/deta-base'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import Sales from '../../models/Sales'

// String -> Future Error Sales
export const findOneSalesByTelegramId = (telegramId) =>
  flDetaBase ('fetch') ({telegram_id: telegramId})

// String -> Future Error Sales
export const findOneSalesById = (salesId) =>
  flDetaBase ('fetch') ({key: salesId})

// StrMap String -> Future Error Array Sales
export const insertManyToSales = (data) =>
  sameValues (S.keys (data)) (Sales)
    ? flDetaBase ('putMany') (data)
    : F.reject ('Wrong query columns')
