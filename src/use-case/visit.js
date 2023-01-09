import {
  findOneSalesById,
  findOneSalesByTelegramId,
} from '../data-access/sales'
import {
  findAllTodayVisits,
  insertOneToVisits,
} from '../data-access/visits'
import {F, maybeToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'

// StrMap String -> Future String String
export const addVisit = S.pipe ([
  (input) =>
    F.both (
      S.pipe ([ S.remove ('telegram_id'), F.resolve ]) (input),
    ) (
      S.pipe ([
        S.prop ('telegram_id'),
        findOneSalesByTelegramId,
        S.chain (
          S.ifElse ((x) => x.rowCount === 0) ((_) =>
            F.reject (
              'No Sales Found With This Telegram Account',
            ),
          ) ((x) => F.resolve (x.rows[0].id.toString ())),
        ),
      ]) (input),
    ),
  S.map ((x) => ({...x[0], sales_id: x[1]})),
  S.chain ((x) => insertOneToVisits (S.keys (x)) (S.values (x))),
])

// String -> Future String String
export const getVisitUpdate = S.pipe ([
  (salesId) =>
    F.both (
      S.pipe ([
        findOneSalesById,
        S.map (S.prop ('rows')),
        S.map (S.head),
        S.chain (maybeToFuture),
      ]) (salesId),
    ) (
      S.pipe ([
        findAllTodayVisits,
        S.map (S.prop ('rowCount')),
      ]) (new Date (Date.now ()).toISOString ()),
    ),
  S.map ((x) => ({user: x[0], todayVisit: x[1]})),
])
