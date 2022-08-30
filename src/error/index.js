import {eitherToFuture, execute} from '../lib/fluture'
import {S} from '../lib/sanctuary/instance'
import {getChatIdFromRequest} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

// TODO Add Error body JSON
export const errorHandler = (err, req, res, _) => {
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) => sendMessage (chatId) (`ERROR: ${err}`)),
    execute,
  ]) (req)

  res.header ('Content-Type', 'application/json')
  res.status (200).send (err)
}
