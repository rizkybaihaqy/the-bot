import {capitalCase, snakeCase} from 'change-case'
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
import {objDiff} from '../../lib/utils/getter'
import {visitRules} from '../../rules/visit'
import {addVisit} from '../../use-case/visit'

// Req -> boolean
const isVisitSubmit = S.pipe ([
  getMessageFromRequest,
  S.chain (getReplyMessageFromMessage),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#VisitSubmit')),
  S.fromRight (false),
])

// StrMap -> Either String StrMap String
const validateUserInput = S.ifElse (
  S.pipe ([ objDiff (visitRules), (x) => x.length === 0 ]),
) (S.pipe ([ S.ap (visitRules), S.sequence (S.Either) ])) (
  S.pipe ([
    objDiff (visitRules),
    S.map (capitalCase),
    (x) => 'Missing Field ' + x,
    S.Left,
  ]),
)

// Message -> Either String StrMap String
const getVisitDataFromReplyMessage = S.pipe ([
  getReplyMessageFromMessage,
  S.chain (getTextFromMessage),
  S.map (S.lines),
  S.map (S.map (S.splitOn (':'))),
  S.map (S.filter ((x) => x.length === 2)),
  S.map (
    S.map (([ key, value ]) =>
      S.Pair (snakeCase (key)) (S.trim (value)),
    ),
  ),
  S.map (S.fromPairs),
])

// Message -> Either String Array String
const getUserInput = (msg) =>
  S.lift3 ((visitData) => (location) => (telegramId) => ({
    ...visitData,
    location,
    telegram_id: telegramId,
  })) (getVisitDataFromReplyMessage (msg)) (
    getLocationFromMessage (msg),
  ) (getTelegramIdFromMessage (msg))

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isVisitSubmit) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getUserInput),
      S.chain (validateUserInput),
      S.map (S.values),
      eitherToFuture,
      S.chain (addVisit),
      S.chain ((msg) =>
        F.both (
          locals.sendMessage ({remove_keyboard: true}) (
            'Data Berhasil di input',
          ),
        ) (sendMessageToAdmin ('Ada inputan baru')),
      ),
      S.map ((x) => x[1]),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
