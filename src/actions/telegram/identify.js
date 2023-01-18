import {Next} from 'fluture-express'
import {eitherToFuture} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getCallbackQueryFromUpdate,
  getChatIdFromMessage,
  getMessageFromUpdate,
  getUpdateFromRequest,
} from '../../lib/telegram/getter'
import {sendMessage} from '../../lib/telegram/request'

export default locals =>
  S.pipe ([
    getUpdateFromRequest,
    S.chain (update =>
      S.alt (getMessageFromUpdate (update)) (
        S.pipe ([
          getCallbackQueryFromUpdate,
          S.chain (getMessageFromUpdate),
        ]) (update)
      )
    ),
    S.chain (getChatIdFromMessage),
    S.map (chatId =>
      S.insert ('sendMessage') (sendMessage (chatId)) (locals)
    ),
    eitherToFuture,
    S.map (Next),
  ])
