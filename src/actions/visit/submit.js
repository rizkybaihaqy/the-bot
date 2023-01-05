import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData, eitherToFuture} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getLocationFromMessage,
  getMessageFromRequest,
  getReplyMessageFromMessage,
  getTelegramIdFromMessage,
  getTextFromMessage,
} from '../../lib/telegram/getter'
import {sendMessageToAdmin} from '../../lib/telegram/request'
import {addVisit} from '../../use-case/visit'

// Req -> boolean
const isVisitSubmit = S.pipe ([
  getMessageFromRequest,
  S.chain (getReplyMessageFromMessage),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#VisitSubmit')),
  S.fromRight (false),
])

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
  S.ifElse (isVisitSubmit) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getUserInput),
      eitherToFuture,
      S.chain (addVisit),
      S.chain ((msg) =>
        F.both (
          locals.sendMessage ({remove_keyboard: true}) ('Data Berhasil di input'),
        ) (sendMessageToAdmin ('Ada inputan baru')),
      ),
      S.map ((x) => x[1]),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
