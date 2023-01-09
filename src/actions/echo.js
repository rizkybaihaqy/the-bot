import {Next} from 'fluture-express'
import {F, JSONData, eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getEntityFromMessage,
  getMessageFromRequest,
  getTextFromMessage,
} from '../lib/telegram/getter'
import {isCommandEqualsTo} from '../lib/telegram/predicate'
import {isEmptyString} from '../lib/utils/predicate'

// Message -> Either String String
const getEchoMessage = S.pipe ([
  (msg) =>
    S.lift2 (
      (text) => (entity) =>
        text.slice (
          S.prop ('offset') (entity) +
            S.prop ('length') (entity),
        ),
    ) (getTextFromMessage (msg)) (
      getEntityFromMessage ('bot_command') (msg),
    ),
  S.map (S.trim),
  S.chain (S.tagBy (S.complement (isEmptyString))),
  S.mapLeft (S.K ('Can Not Echo Nothing')),
])

export default (locals) => (req) =>
  S.ifElse (isCommandEqualsTo ('/echo')) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getEchoMessage),
      eitherToFuture,
      S.chain (locals.sendMessage ({remove_keyboard: true})),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
