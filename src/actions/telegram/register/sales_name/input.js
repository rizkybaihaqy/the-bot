import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../../lib/fluture'
import {S} from '../../../../lib/sanctuary'

const isInputSalesName = S.pipe ([
  S.gets (S.is ($.String)) ([
    'body',
    'message',
    'reply_to_message',
    'text',
  ]),
  S.map (text => text.includes ('#InputSalesName')),
  S.fromMaybe (false),
])

export default locals =>
  S.ifElse (isInputSalesName) (
    S.pipe ([
      S.gets (S.is ($.String)) (['body', 'message', 'text']),
      S.maybe (
        S.Left (
          '#InputSalesName\n' +
            'You are not providing your name\n' +
            'Please provide your name'
        )
      ) (full_name =>
        S.Right (`${full_name}\nUse this name?`)
      ),
      S.either (locals.sendMessage ({force_reply: true})) (
        locals.sendMessage ({
          inline_keyboard: [
            [
              {
                text: 'yes',
                callback_data: 'save-sales-name',
              },
            ],
            [
              {
                text: 'no',
                callback_data: 'change-sales-name',
              },
            ],
          ],
        })
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
