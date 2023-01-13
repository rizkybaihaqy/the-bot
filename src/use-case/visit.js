import {
  findAllTodayVisits,
  findOneSalesById,
  findOneSalesByTelegramId,
  insertOneToVisits,
} from '../data-access'
import {F} from '../lib/fluture'
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
        S.chain ((sales) =>
          sales.sales_code
            ? F.resolve (sales.sales_code)
            : F.reject (
                'No Sales Found With This Telegram Account',
              ),
        ),
      ]) (input),
    ),
  S.map ((x) => ({...x[0], sales_id: x[1]})),
  S.chain ((x) => insertOneToVisits (x)),
  S.map (S.pipe ([ S.prop ('sales_id'), (x) => x.toString () ])),
])

// String -> Future String Object
export const getVisitUpdate = S.pipe ([
  (salesId) =>
    F.both (findOneSalesById (salesId)) (
      S.pipe ([ findAllTodayVisits, S.map ((x) => x.length) ]) (
        new Date (Date.now ()).toISOString (),
      ),
    ),
  S.map ((x) => ({user: x[0], todayVisit: x[1]})),
])
