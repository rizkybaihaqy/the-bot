import Future from 'fluture'
import {Json, Next} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary/instance'
import {
  getChatIdFromRequest,
  getMessageFromRequest,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'
import {
  isChatIdAvailable,
  isTextAvailable,
} from '../lib/telegram/validation'
import {tap} from '../lib/utils'

export default (locals) => (req) => {
  if (
    req.body.message.entities &&
    req.body.message.entities[0].type == 'bot_command'
  ) {
    switch (req.body.message.text.split (' ')[0]) {
      case '/ping':
        return S.pipe ([
          getChatIdFromRequest,
          eitherToFuture,
          S.chain ((chatId) => sendMessage (chatId) ('pong')),
          S.map ((msg) => Json (msg.data)),
        ]) (req)
      case '/echo':
        const msg = req.body.message.text.slice (
          req.body.message.entities[0].length + 1,
        )
        return S.pipe ([
          getChatIdFromRequest,
          eitherToFuture,
          S.chain ((chatId) =>
            sendMessage (chatId) (
              msg != '' ? msg : 'Pls add msg',
            ),
          ),
          S.map ((msg) => Json (msg.data)),
        ]) (req)
      default:
        break
    }
  } else {
    return Future.resolve (Next (locals))
  }
}
