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
import {surveyRules} from '../../rules/survey'

// StrMap a
const visitRulesWithoutLocationReasonAdditionalDesc =
  S.pipe ([
    S.remove ('location'),
    S.remove ('reason'),
    S.remove ('additional_desc'),
  ]) (surveyRules)

// Req -> boolean
const isSurveyForm = S.pipe ([
  getUpdateFromRequest,
  S.chain (getMessageFromUpdate),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#SurveyForm')),
  S.fromRight (false),
])

// Message -> Either String StrMap String
const getSurveyDataFromMessage = S.pipe ([
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
  S.ifElse (isSurveyForm) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (getMessageFromUpdate),
      S.chain (getSurveyDataFromMessage),
      S.chain (
        validate (
          visitRulesWithoutLocationReasonAdditionalDesc,
        ),
      ),
      S.map (S.pairs),
      S.map (S.map ((x) => S.fst (x) + ':' + S.snd (x))),
      S.map (S.unlines),
      S.map ((x) => '#SurveyReason\n' + x),
      eitherToFuture,
      S.chain (
        locals.sendMessage ({
          inline_keyboard: [
            [
              {
                text: 'Tidak Butuh Internet',
                callback_data: 'no_need_for_internet',
              },
            ],
            [
              {
                text: 'Sudah Berlangganan Kompetitor',
                callback_data:
                  'already_subscribe_to_competitor',
              },
            ],
            [
              {
                text: 'Perlu Paket yang Lebih Murah',
                callback_data: 'need_cheaper_package',
              },
            ],
            [
              {
                text: 'Pernah Berlangganan, Kecewa',
                callback_data: 'unsubscribed_disappointed',
              },
            ],
            [
              {
                text: 'Lainnya',
                callback_data: 'other',
              },
            ],
          ],
        }),
      ),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
