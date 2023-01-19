import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../../lib/fluture'
import {S} from '../../../../lib/sanctuary'

const isSaveSalesCode = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.map (S.equals ('save-sales-code')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isSaveSalesCode) (
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
      S.map (
        ([name, code]) =>
          '#SaveSales\n' +
          `name:${name}\n` +
          `code:${code}\n` +
          'Is your data correct?'
      ),
      S.maybe (
        F.reject ('Failed To Get Data @SaveSalesCodeAction')
      ) (locals.sendMessage ({force_reply: true})),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
