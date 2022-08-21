import {Json} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary/instance'
import {
  getChatIdFromRequest,
  getMessageFromRequest,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'
import { isChatIdAvailable, isTextAvailable } from '../lib/telegram/validation'
import {tap} from '../lib/utils'

export default (_) => (req) => {
  if (req.body.message.entities && req.body.message.entities[0].type == 'bot_command') {
    switch (req.body.message.text) {
        case '/ping':
            return S.pipe ([
                getMessageFromRequest,
                tap,
                eitherToFuture,
                S.chain ((msg) => sendMessage (msg.chat.id) ('pong')),
                S.map ((msg) => Json (msg.data)),
              ]) (req)
        default:
            break
    }
  } else {
    return S.pipe ([
        getMessageFromRequest,
        S.chain (isChatIdAvailable),
        S.chain (isTextAvailable),
        eitherToFuture,
        S.chain ((msg) => sendMessage (msg.chat.id) (msg.text)),
        S.map ((msg) => Json (msg.data)),
      ]) (req)
  }
}
