import {F, maybeToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {sendMessage} from '../lib/telegram/request'
import {alt_} from '../lib/utils/function'
import {get, gets} from '../lib/utils/object'

// TODO Make It Pure
export const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line functional/no-expression-statement
  console.error (`Telegram Request Error: ${err}`)

  // eslint-disable-next-line functional/no-expression-statement
  S.pipe ([
    get ('body'),
    S.chain (
      alt_ (get ('message')) (
        gets (['callback_query', 'message'])
      )
    ),
    S.chain (gets (['chat', 'id'])),
    maybeToFuture,
    S.chain (chatId =>
      sendMessage (chatId) ({
        remove_keyboard: true,
      }) (`ERROR: ${err}`)
    ),
    S.mapLeft (
      S.K ('Failed To Send Error Message To Telegram')
    ),
    F.fork (next) (x =>
      res.status (200).json ({ok: false, error: x.data})
    ),
  ]) (req)
}
