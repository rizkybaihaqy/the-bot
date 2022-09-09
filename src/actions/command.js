import F from 'fluture'
import {Next} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary/instance'
import {getBotCommandFromRequest} from '../lib/telegram/getter'
import {command as commandRouting} from '../lib/telegram/routing'

export default (locals) => (req) =>
  S.pipe ([
    getBotCommandFromRequest,
    eitherToFuture,
    S.chain (commandRouting (req)),
    F.chainRej (S.K (F.resolve (Next (locals)))),
  ]) (req)
