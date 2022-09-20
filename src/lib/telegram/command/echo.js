import {JSONData, eitherToFuture} from '../../fluture'
import {S} from '../../sanctuary/instance'
import {getBotCommandArgument} from '../getter'
import {replyTo} from '../request'

export const echo = (req) =>
  S.pipe ([
    getBotCommandArgument,
    eitherToFuture,
    S.chain (replyTo (req)),
    S.map (JSONData),
  ]) (req)
