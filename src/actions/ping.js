import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData, eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getChatIdFromMessage,
  getEntityTextFromMessage,
  getMessageFromRequest,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

const isPing = S.pipe ([
  getMessageFromRequest,
  S.chain (getEntityTextFromMessage ('bot_command')),
  S.map (S.equals ('/ping')),
  S.fromRight (false),
])

export default (locals) => (req) =>
  S.ifElse (isPing) (
    S.pipe ([
      (_) => 'ping',
      sendMessage ({
        remove_keyboard: true,
      }) (S.prop ('chatId') (locals)),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
