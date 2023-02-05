import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../../lib/fluture'
import {S} from '../../../../lib/sanctuary'
import {t} from '../../../../translation'

const isChangeSalesName = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.map (S.equals ('change-sales-name')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isChangeSalesName) (
    S.pipe ([
      S.K ('#InputSalesName\n' + t ('msg_input_sales_name')),
      locals.sendMessage ({force_reply: true}),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
