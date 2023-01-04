import F from 'fluture'
import {Next} from 'fluture-express'
import {getSalesByTelegramId} from '../../data-access/sales'
import {insertOneToVisits} from '../../data-access/visits'
import {JSONData, eitherToFuture} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getChatIdFromMessage,
  getEntityTextFromMessage,
  getLocationFromMessage,
  getMessageFromRequest,
  getReplyMessageFromMessage,
  getTextFromMessage,
} from '../../lib/telegram/getter'

// Req -> boolean
const isVisitSubmit = S.pipe ([
  getMessageFromRequest,
  S.chain (getReplyMessageFromMessage),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#VisitSubmit')),
  S.fromRight (false),
])

// Message -> Either String Array
const getVisitDataFromReplyMessage = S.pipe ([
  getReplyMessageFromMessage,
  S.chain (getTextFromMessage),
  S.map (S.lines),
  S.map (S.map (S.splitOn (':'))),
  S.map (S.filter ((x) => x.length === 2)),
  S.map (S.map ((x) => S.Pair (x[0]) (x[1]))),
  S.map (S.map (S.snd)),
  S.map (S.map (S.trim)),
])

// Message -> Either String Array
const getVisitDataAndLocation = (msg) =>
  S.lift2 ((x) => (y) => [ ...x, y ]) (
    getVisitDataFromReplyMessage (msg),
  ) (getLocationFromMessage (msg))

// Message -> Future Error String
const getSalesIdFromTelegramId = S.pipe ([
  getChatIdFromMessage,
  eitherToFuture,
  S.chain (getSalesByTelegramId),
  S.chain (
    S.ifElse ((x) => x.rowCount === 0) ((_) =>
      F.reject ('No Sales Found With This Telegram Account'),
    ) ((x) => F.resolve (x.rows[0].id.toString ())),
  ),
])

// Message -> Future Error Array
const getVisitDataLocationAndSalesId = S.pipe ([
  (msg) =>
    F.both (
      S.pipe ([ getVisitDataAndLocation, eitherToFuture ]) (
        msg,
      ),
    ) (getSalesIdFromTelegramId (msg)),
  S.map (([ visitAndLocation, salesId ]) => [
    ...visitAndLocation,
    salesId,
  ]),
])

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isVisitSubmit) (
    S.pipe ([
      getMessageFromRequest,
      eitherToFuture,
      S.chain (getVisitDataLocationAndSalesId),
      S.chain (insertOneToVisits),
      S.chain (locals.sendMessage ({remove_keyboard: true})),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
