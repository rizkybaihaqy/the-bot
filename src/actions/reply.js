import F from 'fluture'
import {Next} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getHashtagFromMessage,
  getHashtagFromRequest,
  getReplyFromRequest,
  getReplyMessageFromRequest,
} from '../lib/telegram/getter'
import {isReply} from '../lib/telegram/predicate'
import {hastag as hastagRouting} from '../lib/telegram/routing'

export default (locals) => (req) =>
  S.ifElse (isReply) (
    S.pipe ([
      getReplyMessageFromRequest,
      S.chain (getHashtagFromMessage),
      eitherToFuture,
      S.chain (hastagRouting (req)),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
