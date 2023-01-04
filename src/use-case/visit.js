import {findOneSales} from '../data-access/sales'
import {insertOneToVisits} from '../data-access/visits'
import {F, maybeToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'

// Array String -> Future String String
export const addVisit = S.pipe ([
  (input) =>
    F.both (
      S.pipe ([
        S.reverse,
        S.tail,
        S.fromMaybe ([]),
        S.reverse,
        F.resolve,
      ]) (input),
    ) (
      S.pipe ([
        S.last,
        maybeToFuture,
        S.chain (findOneSales),
        S.chain (
          S.ifElse ((x) => x.rowCount === 0) ((_) =>
            F.reject (
              'No Sales Found With This Telegram Account',
            ),
          ) ((x) => F.resolve (x.rows[0].id.toString ())),
        ),
      ]) (input),
    ),
  S.map ((x) => [ ...x[0], x[1] ]),
  S.chain (insertOneToVisits),
])
