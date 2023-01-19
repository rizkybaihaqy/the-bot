import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../lib/fluture'
import {S} from '../../../lib/sanctuary'
import {isCommandEqualsTo} from '../../../lib/telegram/predicate'

export default locals =>
  S.ifElse (isCommandEqualsTo ('/register')) (
    S.pipe ([
      req =>
        S.lift2 (S.concat) (
          S.gets (S.is ($.String)) ([
            'body',
            'message',
            'from',
            'first_name',
          ]) (req)
        ) (
          S.gets (S.is ($.String)) ([
            'body',
            'message',
            'from',
            'last_name',
          ]) (req)
        ),
      S.maybe (
        S.Left (
          '#InputSalesName\nCannot get your name. Please provide your name'
        )
      ) (full_name =>
        S.Right (`Hi ${full_name}. Use this name?`)
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
