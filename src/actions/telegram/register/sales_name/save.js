import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../../lib/fluture'
import {S} from '../../../../lib/sanctuary'

const isSaveSalesName = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.map (S.equals ('save-sales-name')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isSaveSalesName) (
    S.pipe ([
      S.gets (S.is ($.String)) ([
        'body',
        'callback_query',
        'message',
        'text',
      ]),
      S.map (S.lines),
      S.chain (S.head),
      S.map (
        sales_name =>
          '#InputSalesCode\n' +
          `name: ${sales_name}\n` +
          'Please provide your sales code'
      ),
      S.maybe (
        F.reject ('Failed To Get Data @SaveSalesNameAction')
      ) (locals.sendMessage ({force_reply: true})),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
