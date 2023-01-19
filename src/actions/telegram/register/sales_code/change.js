import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../../lib/fluture'
import {S} from '../../../../lib/sanctuary'

const isChangeSalesCode = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.map (S.equals ('change-sales-code')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isChangeSalesCode) (
    S.pipe ([
      S.gets (S.is ($.String)) ([
        'body',
        'callback_query',
        'message',
        'text',
      ]),
      S.map (S.lines),
      S.chain (S.head),
      S.map (S.splitOn (':')),
      S.chain (S.head),
      S.map (
        name =>
          '#InputSalesCode\n' +
          `name: ${name}\n` +
          'Please provide your sales code'
      ),
      S.maybe (
        F.reject (
          'Failed To Get Data @ChangeSalesCodeAction'
        )
      ) (locals.sendMessage ({force_reply: true})),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
