import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData, eitherToFuture} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getLocationFromMessage,
  getMessageFromRequest,
  getReplyMessageFromMessage,
  getTelegramIdFromMessage,
  getTextFromMessage,
} from '../../lib/telegram/getter'
import {isHashtagEqualsTo} from '../../lib/telegram/predicate'
import {addVisit} from '../../use-case/visit'

// Message -> Either String Array String
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

// Message -> Either String Array String
const getUserInput = (msg) =>
  S.lift3 ((x) => (y) => (z) => [ ...x, y, z ]) (
    getVisitDataFromReplyMessage (msg),
  ) (getLocationFromMessage (msg)) (
    getTelegramIdFromMessage (msg),
  )

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isHashtagEqualsTo ('#VisitSubmit')) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getUserInput),
      eitherToFuture,
      S.chain (addVisit),
      S.chain (locals.sendMessage ({remove_keyboard: true})),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
