import {insertOneToSales} from '../data-access'
import {S} from '../lib/sanctuary'
import {now} from '../lib/utils/getter'

// StrMap String -> Future String Survey
export const addSales = S.pipe ([
  S.insert ('created_at') (now),
  insertOneToSales,
])
