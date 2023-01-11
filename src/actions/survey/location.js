import {snakeCase} from 'change-case'
import {Next} from 'fluture-express'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getLocationFromMessage,
  getMessageFromUpdate,
  getReplyMessageFromMessage,
  getTextFromMessage,
  getUpdateFromRequest,
} from '../../lib/telegram/getter'

// Req -> boolean
const isSurveyLocation = S.pipe ([
  getUpdateFromRequest,
  S.chain (getMessageFromUpdate),
  S.chain (getReplyMessageFromMessage),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#SurveyLocation')),
  S.fromRight (false),
])

// Message -> Either String StrMap String
const getSurveyData = S.pipe ([
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
  S.lift2 ((visitData) => (location) => ({
    ...visitData,
    location,
  })) (getSurveyData (msg)) (getLocationFromMessage (msg))

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isSurveyLocation) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (getMessageFromUpdate),
      S.chain (getUserInput),
      S.map ((x) => (console.log (x), x)),
      eitherToFuture,
      S.chain ((_) =>
        locals.sendMessage ({remove_keyboard: true}) (
          'Data Berhasil di input',
        ),
      ),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
