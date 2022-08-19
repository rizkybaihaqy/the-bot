import {eitherToFuture, execute} from '../lib/fluture'
import {S} from '../lib/sanctuary/instance'
import {getChatIdFromRequest} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

export const errorHandler = (err, req, res, _) => {
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((msg) => sendMessage (msg) (err)),
    execute,
  ]) (req)

  res.header ('Content-Type', 'application/json')
  res.status (200).send (err)
}
