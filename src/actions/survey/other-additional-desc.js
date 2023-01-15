import {Next} from 'fluture-express'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getCallbackQueryFromUpdate,
  getDataFromCallbackQuery,
  getEntityTextFromMessage,
  getFormDataFromText,
  getMessageFromUpdate,
  getReplyMessageFromMessage,
  getTextFromFormData,
  getTextFromMessage,
  getUpdateFromRequest,
} from '../../lib/telegram/getter'
import {validate} from '../../lib/utils/validator'
import {surveyRules} from '../../rules/survey'

// StrMap a
const surveyAdditionalDescRules =
  S.remove ('location') (surveyRules)

// Req -> boolean
const isSurveyOtherAdditionalDesc = S.pipe ([
  getUpdateFromRequest,
  S.chain (getMessageFromUpdate),
  S.chain (getReplyMessageFromMessage),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#SurveyOtherAdditionalDesc')),
  S.fromRight (false),
])

const getAdditionalDescFromMessage = update =>
  S.lift2 (survey => additional_desc => ({
    ...survey,
    additional_desc,
  })) (
    S.pipe ([
      getMessageFromUpdate,
      S.chain (getReplyMessageFromMessage),
      S.chain (getTextFromMessage),
      S.map (getFormDataFromText),
      S.map (S.remove ('additional_desc')),
    ]) (update)
  ) (
    S.pipe ([
      getMessageFromUpdate,
      S.chain (getTextFromMessage),
    ]) (update)
  )

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isSurveyOtherAdditionalDesc) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (getAdditionalDescFromMessage),
      S.chain (validate (surveyAdditionalDescRules)),
      S.map (getTextFromFormData),
      S.map (S.concat ('#SurveyLocation\n')),
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
        })
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
