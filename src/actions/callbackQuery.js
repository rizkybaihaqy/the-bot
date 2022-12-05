import F from 'fluture'
import {Next} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {getCallbackDataFromRequest} from '../lib/telegram/getter'
import {isCallbackQuery} from '../lib/telegram/predicate'
import {callbackData as callbackDataRouting} from '../lib/telegram/routing'

export default (locals) => (req) =>
  S.ifElse (isCallbackQuery) (
    S.pipe ([
      getCallbackDataFromRequest,
      eitherToFuture,
      S.chain (callbackDataRouting (req)),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
