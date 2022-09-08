import F from 'fluture'
import {Next} from 'fluture-express'
import {S} from '../lib/sanctuary/instance'
import {getBotCommandFromRequest} from '../lib/telegram/getter'
import {isBotCommand} from '../lib/telegram/predicate'
import {command as commandRouting} from '../lib/telegram/routing'

export default (locals) => (req) =>
  S.ifElse (isBotCommand) (
    S.pipe ([
      getBotCommandFromRequest,
      S.fromRight (''),
      commandRouting (req),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
