import {capitalCase, snakeCase} from 'change-case'
import {Next} from 'fluture-express'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getMessageFromRequest,
  getTextFromMessage,
} from '../../lib/telegram/getter'
import {objDiff} from '../../lib/utils/getter'
import {visitRules} from '../../rules/visit'

// StrMap
const visitRulesWithoutLocationTelegramId = S.pipe ([
  S.remove ('location'),
  S.remove ('telegram_id'),
]) (visitRules)

// Req -> boolean
const isVisitReport = S.pipe ([
  getMessageFromRequest,
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

// StrMap -> Either String StrMap String
const validateUserInput = (rules) =>
  S.ifElse (S.pipe ([ objDiff (rules), (x) => x.length === 0 ])) (
    S.pipe ([ S.ap (rules), S.sequence (S.Either) ]),
  ) (
    S.pipe ([
      objDiff (rules),
      S.map (capitalCase),
      (x) => 'Missing Field ' + x,
      S.Left,
    ]),
  )

export default (locals) =>
  S.ifElse (isVisitReport) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getVisitDataFromMessage),
      S.chain (
        validateUserInput (
          visitRulesWithoutLocationTelegramId,
        ),
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
            ],
          ],
        }),
      ),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
