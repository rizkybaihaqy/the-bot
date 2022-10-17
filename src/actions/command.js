import F from 'fluture'
import {Next} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {getBotCommandFromRequest} from '../lib/telegram/getter'
import {isBotCommand} from '../lib/telegram/predicate'
import {command as commandRouting} from '../lib/telegram/routing'

export default (locals) => (req) =>
  S.ifElse (isBotCommand) (
    S.pipe ([
      getBotCommandFromRequest,
      eitherToFuture,
      S.chain (commandRouting (req)),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
