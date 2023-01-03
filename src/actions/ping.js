import F from 'fluture'
import { Next } from 'fluture-express'
import { eitherToFuture, JSONData } from '../lib/fluture'
import { S } from '../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getChatIdFromMessage,
  getMessageFromRequest
} from '../lib/telegram/getter'
import { sendMessage } from '../lib/telegram/request'

const isPing = S.pipe ([
  getMessageFromRequest,
  S.chain (getEntityTextFromMessage ('bot_command')),
  S.map (S.equals ('/ping')),
  S.fromRight (false),
])

export default (locals) => (req) =>
  S.ifElse (isPing) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getChatIdFromMessage),
      eitherToFuture,
      S.chain ((chatId) =>
        sendMessage ({
          remove_keyboard: true,
        }) (chatId) ('pong')),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
