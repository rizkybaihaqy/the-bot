import {eitherToFuture, execute} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getChatIdFromMessage,
  getMessageFromRequest,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

// TODO Make It Pure
export const errorHandler = (err, req, res, _) => {
  console.log ('ERROR:', err)
  S.pipe ([
    getMessageFromRequest,
    S.chain (getChatIdFromMessage),
    eitherToFuture,
    S.chain ((chatId) =>
      sendMessage (chatId) ({
        remove_keyboard: true,
      }) (`ERROR: ${err}`),
    ),
    S.map (
      (x) => (
        res.header ('Content-Type', 'application/json'), x
      ),
    ),
    S.map (
      (x) => (res.status (200).send (`ERROR: ${err}`), x),
    ),
    S.mapLeft (
      (x) => (res.status (200).send (`ERROR: ${err}`), x),
    ),
    execute,
  ]) (req)
}
