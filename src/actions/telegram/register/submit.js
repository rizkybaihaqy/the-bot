import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../../lib/fluture'
import {S} from '../../../lib/sanctuary'
import {t} from '../../../translation'
import {addSales} from '../../../use-case/sales'

const isChangeSalesName = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.map (S.equals ('save-sales')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isChangeSalesName) (
    S.pipe ([
      S.props (['body', 'callback_query']),
      req =>
        S.lift2 (telegram_id => ({name, code}) => ({
          telegram_id,
          name,
          sales_code: code,
        })) (
          S.pipe ([
            S.gets (S.is ($.Number)) (['from', 'id']),
            S.map (id => id.toString ()),
            S.maybeToEither (t ('error_get_telegram_id')),
          ]) (req)
        ) (
          S.pipe ([
            S.gets (S.is ($.String)) (['message', 'text']),
            S.map (S.lines),
            S.map (S.map (S.splitOn (':'))),
            S.map (S.filter (row => row.length === 2)),
            S.map (S.map (S.map (S.trim))),
            S.map (Object.fromEntries),
            S.maybeToEither (t ('error_get_sales_data')),
          ]) (req)
        ),
      eitherToFuture,
      S.chain (addSales),
      S.chain (_ =>
        locals.sendMessage ({remove_keyboard: true}) (
          'Data Disimpan'
        )
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
