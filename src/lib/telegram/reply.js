import {eitherToFuture} from '../fluture'
import {S} from '../sanctuary/'
import {getChatIdFromRequest} from './getter'
import {sendMessage} from './request'

// String -> Req -> Future Err Axios
export const reply = (msg) => (req) =>
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) =>
      sendMessage ({
        remove_keyboard: true,
      }) (chatId) (msg),
    ),
  ]) (req)

export const replyWithInlineKeyboard =
  (inlineKeyboard) => (msg) => (req) =>
    S.pipe ([
      getChatIdFromRequest,
      eitherToFuture,
      S.chain ((chatId) =>
        sendMessage ({
          inline_keyboard: inlineKeyboard,
        }) (chatId) (msg),
      ),
    ]) (req)
