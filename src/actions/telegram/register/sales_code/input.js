import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../../lib/fluture'
import {S} from '../../../../lib/sanctuary'
import {t} from '../../../../translation'

const isInputSalesCode = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'message',
    'reply_to_message',
    'text',
  ]),
  S.map (text => text.includes ('#InputSalesCode')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isInputSalesCode) (
    S.pipe ([
      S.props (['body', 'message']),
      msg =>
        S.lift2 (name => code => [name, code]) (
          S.pipe ([
            S.gets (S.is ($.String)) ([
              'reply_to_message',
              'text',
            ]),
            S.map (S.lines),
            S.chain (S.tail),
            S.chain (S.head),
            S.map (S.splitOn (':')),
            S.chain (S.last),
          ]) (msg)
        ) (S.get (S.is ($.String)) ('text') (msg)),
      S.maybe (
        S.Left (
          '#InputSalesCode\n' + t ('error_get_sales_code')
        )
      ) (([name, code]) =>
        S.Right (
          `name:${name}\n` +
            `code:${code}\n` +
            t ('msg_use_this_sales_code')
        )
      ),
      S.either (locals.sendMessage ({force_reply: true})) (
        locals.sendMessage ({
          inline_keyboard: [
            [
              {
                text: 'yes',
                callback_data: 'save-sales-code',
              },
            ],
            [
              {
                text: 'no',
                callback_data: 'change-sales-code',
              },
            ],
          ],
        })
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
