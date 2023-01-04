import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData, eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getChatIdFromMessage,
  getEntityTextFromMessage,
  getMessageFromRequest,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

export default (locals) => (req) =>
  S.pipe ([
    getMessageFromRequest,
    S.chain (getChatIdFromMessage),
    S.map ((chatId) =>
      S.insert ('sendMessage') (sendMessage (chatId)) (locals),
    ),
    eitherToFuture,
    S.map (Next),
  ]) (req)
