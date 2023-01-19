import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../../lib/fluture'
import {S} from '../../../../lib/sanctuary'

const isSalesNameBranching = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'callback_query',
    'data',
  ]),
  S.map (
    data =>
      data === 'save-sales-code' ||
      data === 'change-sales-code'
  ),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isSalesNameBranching) (
    S.pipe ([
      S.prop ('body'),
      S.ifElse (
        body =>
          body.callback_query.data === 'save-sales-code'
      ) (
        S.pipe ([
          S.gets (S.is ($.String)) ([
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
        ])
      ) (
        S.pipe ([
          S.gets (S.is ($.String)) ([
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
        ])
      ),
      S.maybe (
        F.reject ('Failed To Get Data @SalesCodeAction')
      ) (locals.sendMessage ({force_reply: true})),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
