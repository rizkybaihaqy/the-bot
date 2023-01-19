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
      data === 'save-sales-name' ||
      data === 'change-sales-name'
  ),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isSalesNameBranching) (
    S.pipe ([
      S.prop ('body'),
      S.ifElse (
        body =>
          body.callback_query.data === 'save-sales-name'
      ) (
        S.pipe ([
          S.gets (S.is ($.String)) ([
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
        ])
      ) (
        S.K (
          S.Just (
            '#InputSalesName\nPlease provide your name'
          )
        )
      ),
      S.maybe (
        F.reject ('Failed To Get Data @SalesNameAction')
      ) (locals.sendMessage ({force_reply: true})),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
