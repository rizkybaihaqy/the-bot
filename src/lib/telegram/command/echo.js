import {JSONData, eitherToFuture} from '../../fluture'
import {S} from '../../sanctuary/instance'
import {
  getEntityLength,
  getEntityOffset,
  getTextFromRequest,
} from '../getter'
import {replyTo} from '../request'

export const echo = (req) =>
  S.pipe ([
    getTextFromRequest,
    S.map ((txt) =>
      txt.slice (
        getEntityOffset (req) + getEntityLength (req),
      ),
    ),
    S.map (S.trim),
    S.chain (
      S.ifElse ((txt) => txt === '') ((_) =>
        S.Left ('Cannot Echo Something That Does Not Exist'),
      ) (S.Right),
    ),
    eitherToFuture,
    S.chain (replyTo (req)),
    S.map (JSONData),
  ]) (req)
