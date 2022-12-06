import F from 'fluture'
import {Next} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {getHashtagFromRequest} from '../lib/telegram/getter'
import {isHashTag} from '../lib/telegram/predicate'
import {hastag as hastagRouting} from '../lib/telegram/routing'

export default (locals) => (req) =>
  S.ifElse (isHashTag) (
    S.pipe ([
      getHashtagFromRequest,
      eitherToFuture,
      S.chain (hastagRouting (req)),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)