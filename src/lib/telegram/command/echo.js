import {JSONData, eitherToFuture} from '../../fluture'
import {S} from '../../sanctuary'
import {getBotCommandArgument} from '../getter'
import {reply} from '../reply'

export const echo = (req) =>
  S.pipe ([
    getBotCommandArgument,
    eitherToFuture,
    S.chain (S.flip (reply) (req)),
    S.map (JSONData),
  ]) (req)
