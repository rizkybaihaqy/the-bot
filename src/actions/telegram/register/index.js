import {Next} from 'fluture-express'
import $ from 'sanctuary-def'
import {F, JSONData} from '../../../lib/fluture'
import {S} from '../../../lib/sanctuary'
import {isCommandEqualsTo} from '../../../lib/telegram/predicate'
import {t} from '../../../translation'

export default locals =>
  S.ifElse (isCommandEqualsTo ('/register')) (
    S.pipe ([
      S.props (['body', 'message']),
      msg =>
        S.lift2 (S.concat) (
          S.gets (S.is ($.String)) (['from', 'first_name']) (
            msg
          )
        ) (
          S.gets (S.is ($.String)) (['from', 'last_name']) (
            msg
          )
        ),
      S.maybe (
        S.Left (
          '#InputSalesName\n' + t ('error_get_telegram_name')
        )
      ) (full_name =>
        S.Right (`Hi ${full_name}. ` + t ('msg_use_this_name'))
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
