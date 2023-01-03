import {JSONData, eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getChatIdFromMessage,
  getMessageFromRequest,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

export default (_) => (req) =>
  S.pipe ([
    getMessageFromRequest,
    S.map ((x) => (console.log (x), x)),
    S.chain (getChatIdFromMessage),
    eitherToFuture,
    S.chain ((chatId) =>
      sendMessage ({
        remove_keyboard: true,
      }) (chatId) ('Default Handler Only In Dev'),
    ),
    S.map (JSONData),
  ]) (req)
