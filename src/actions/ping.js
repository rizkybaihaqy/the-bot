import {Next} from 'fluture-express'
import {F, JSONData} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getMessageFromRequest,
} from '../lib/telegram/getter'
import {isCommandEqualsTo} from '../lib/telegram/predicate'

const isPing = S.pipe ([
  getMessageFromRequest,
  S.chain (getEntityTextFromMessage ('bot_command')),
  S.map (S.equals ('/ping')),
  S.fromRight (false),
])

export default (locals) => (req) =>
  S.ifElse (isCommandEqualsTo ('/ping')) (
    S.pipe ([
      (_) => 'pong',
      locals.sendMessage ({remove_keyboard: true}),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
