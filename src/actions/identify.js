import {Next} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getChatIdFromMessage,
  getMessageFromUpdate,
  getUpdateFromRequest,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

export default (locals) => (req) =>
  S.pipe ([
    getUpdateFromRequest,
    S.chain (getMessageFromUpdate),
    S.chain (getChatIdFromMessage),
    S.map ((chatId) =>
      S.insert ('sendMessage') (sendMessage (chatId)) (locals),
    ),
    eitherToFuture,
    S.map (Next),
  ]) (req)
