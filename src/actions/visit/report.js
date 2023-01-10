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
  getMessageFromUpdate,
  getTextFromMessage,
  getUpdateFromRequest,
} from '../../lib/telegram/getter'
import {validate} from '../../lib/utils/validator'
import {visitRules} from '../../rules/visit'

// StrMap a
const visitRulesWithoutLocationTelegramId = S.pipe ([
  S.remove ('location'),
  S.remove ('telegram_id'),
]) (visitRules)

// Req -> boolean
const isVisitReport = S.pipe ([
  getUpdateFromRequest,
  S.chain (getMessageFromUpdate),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#VisitReport')),
  S.fromRight (false),
])

// Message -> Either String StrMap String
const getVisitDataFromMessage = S.pipe ([
  getTextFromMessage,
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

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isVisitReport) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (getMessageFromUpdate),
      S.chain (getVisitDataFromMessage),
      S.chain (
        validate (visitRulesWithoutLocationTelegramId),
      ),
      S.map (S.pairs),
      S.map (S.map ((x) => S.fst (x) + ':' + S.snd (x))),
      S.map (S.unlines),
      S.map ((x) => '#VisitSubmit\n' + x),
      eitherToFuture,
      S.chain (
        locals.sendMessage ({
          keyboard: [
            [
              {
                text: 'Send Location',
                request_location: true,
              },
              {
                text: 'Cancel',
              },
            ],
          ],
          input_field_placeholder:
            'Send Location If The Data Already Correct',
          resize_keyboard: true,
        }),
      ),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
