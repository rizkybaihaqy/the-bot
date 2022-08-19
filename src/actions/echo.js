import {Json} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary/instance'
import {getMessageFromRequest} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'
import {
  isChatIdAvailable,
  isTextAvailable,
} from '../lib/telegram/validation'

export default (_) => (req) =>
  S.pipe ([
    getMessageFromRequest,
    S.chain (isChatIdAvailable),
    S.chain (isTextAvailable),
    eitherToFuture,
    S.chain ((msg) => sendMessage (msg.chat.id) (msg.text)),
    S.map ((msg) => Json (msg.data)),
  ]) (req)
