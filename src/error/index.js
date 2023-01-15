import {eitherToFuture, execute} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getCallbackQueryFromUpdate,
  getChatIdFromMessage,
  getMessageFromUpdate,
  getUpdateFromRequest,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

// TODO Make It Pure
export const errorHandler = (err, req, res, _) => {
  console.log ('ERROR:', err)
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
    eitherToFuture,
    S.chain (chatId =>
      sendMessage (chatId) ({
        remove_keyboard: true,
      }) (`ERROR: ${err}`)
    ),
    S.map (
      x => (
        res.header ('Content-Type', 'application/json'), x
      )
    ),
    S.map (
      x => (res.status (200).send (`ERROR: ${err}`), x)
    ),
    S.mapLeft (
      x => (res.status (200).send (`ERROR: ${err}`), x)
    ),
    execute,
  ]) (req)
}
