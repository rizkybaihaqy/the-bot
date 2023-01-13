import {flDetaBase} from '../../db/deta-base'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sameValues} from '../../lib/utils/getter'
import Sales from '../../models/Sales'

// String -> Future Error Sales
export const findOneSalesByTelegramId = S.pipe ([
  (tId) => flDetaBase ('sales') ('fetch') ({telegram_id: tId}),
  S.map (S.prop ('items')),
  S.map (S.head),
  S.map (S.fromMaybe ({})),
])

// String -> Future Error Sales
export const findOneSalesById = (salesId) =>
  S.pipe ([
    (sId) =>
      flDetaBase ('sales') ('fetch') ({sales_code: sId}),
    S.map (S.prop ('items')),
    S.map (S.head),
    S.map (S.fromMaybe ({})),
  ])

// StrMap String -> Future Error Array Sales
export const insertManyToSales = (data) =>
  S.all ((x) => sameValues (Sales) (S.keys (x))) (data)
    ? S.pipe ([
        flDetaBase ('sales') ('putMany'),
        S.map (S.props ([ 'processed', 'items' ])),
      ]) (data)
    : F.reject ('Wrong query columns Sales')
