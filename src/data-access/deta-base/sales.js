import {flDetaBase} from '../../db/deta-base'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sameValues} from '../../lib/utils/getter'
import Sales from '../../models/Sales'

// StrMap String -> Future Error Survey
export const insertOneToSales = data =>
  sameValues (S.keys (data)) (Sales)
    ? S.pipe ([
        data => ({type: 'sales', data}),
        flDetaBase ('put'),
        S.map (S.prop ('data')),
      ]) (data)
    : F.reject ('Wrong query columns Sales')

// String -> Future Error Sales
export const findOneSalesByTelegramId = S.pipe ([
  tId =>
    flDetaBase ('fetch') ({'data.telegram_id?contains': tId}),
  S.map (S.prop ('items')),
  S.map (S.head),
  S.map (S.map (S.prop ('data'))),
  S.map (S.fromMaybe ({})),
])

// String -> Future Error Sales
export const findOneSalesById = S.pipe ([
  sId =>
    flDetaBase ('fetch') ({'data.sales_code?contains': sId}),
  S.map (S.prop ('items')),
  S.map (S.head),
  S.map (S.map (S.prop ('data'))),
  S.map (S.fromMaybe ({})),
])

// Empty -> Future Error Array Sales
export const findAllSales = S.pipe ([
  _ => flDetaBase ('fetch') ({type: 'sales'}),
  S.map (S.prop ('items')),
  S.map (S.map (S.prop ('data'))),
])

// StrMap String -> Future Error Array Sales
export const insertManyToSales = data =>
  S.all (x => sameValues (Sales) (S.keys (x))) (data)
    ? S.pipe ([
        S.map (data => ({type: 'sales', data})),
        flDetaBase ('putMany'),
        S.map (S.props (['processed', 'items'])),
        S.map (S.map (S.prop ('data'))),
      ]) (data)
    : F.reject ('Wrong query columns Sales')
