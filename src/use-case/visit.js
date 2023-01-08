import {findOneSales} from '../data-access/sales'
import {insertOneToVisits} from '../data-access/visits'
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
        findOneSales,
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
