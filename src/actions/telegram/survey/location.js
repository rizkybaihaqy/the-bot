import {Next} from 'fluture-express'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../../lib/fluture'
import {S} from '../../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getFormDataFromText,
  getLocationFromMessage,
  getMessageFromUpdate,
  getReplyMessageFromMessage,
  getTextFromMessage,
  getUpdateFromRequest,
} from '../../../lib/telegram/getter'
import {validate} from '../../../lib/utils/validator'
import {surveyRules} from '../../../rules/survey'
import {addSurvey} from '../../../use-case/survey'

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
  S.map (getFormDataFromText),
])

// Message -> Either String Array String
const getUserInput = msg =>
  S.lift2 (visitData => location => ({
    ...visitData,
    location,
  })) (getSurveyData (msg)) (getLocationFromMessage (msg))

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isSurveyLocation) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (getMessageFromUpdate),
      S.chain (getUserInput),
      S.chain (validate (surveyRules)),
      eitherToFuture,
      S.chain (addSurvey),
      S.chain (_ =>
        locals.sendMessage ({remove_keyboard: true}) (
          'Data Berhasil di input'
        )
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
