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
const surveyAdditionalInfoRules =
  S.remove ('location') (surveyRules)

// Req -> boolean
const isSurveyAdditionalInfo = S.pipe ([
  getUpdateFromRequest,
  S.chain ((update) =>
    S.alt (
      S.pipe ([
        getMessageFromUpdate,
        S.chain (getReplyMessageFromMessage),
      ]) (update),
    ) (
      S.pipe ([
        getCallbackQueryFromUpdate,
        S.chain (getMessageFromUpdate),
      ]) (update),
    ),
  ),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#SurveyAdditionalInfo')),
  S.fromRight (false),
])

const getAdditionalInfoFromMessage = (update) =>
  S.lift2 ((survey) => (additional_desc) => ({
    ...survey,
    additional_desc,
  })) (
    S.pipe ([
      getMessageFromUpdate,
      S.chain (getReplyMessageFromMessage),
      S.chain (getTextFromMessage),
      S.map (getFormDataFromText),
    ]) (update),
  ) (
    S.pipe ([
      getMessageFromUpdate,
      S.chain (getTextFromMessage),
    ]) (update),
  )

const getAdditionalInfoFromCallbackData = (update) =>
  S.lift2 ((survey) => (additional_desc) => ({
    ...survey,
    additional_desc,
  })) (
    S.pipe ([
      getCallbackQueryFromUpdate,
      S.chain (getMessageFromUpdate),
      S.chain (getTextFromMessage),
      S.map (getFormDataFromText),
    ]) (update),
  ) (
    S.pipe ([
      getCallbackQueryFromUpdate,
      S.chain (getDataFromCallbackQuery),
    ]) (update),
  )

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isSurveyAdditionalInfo) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain ((update) =>
        S.alt (getAdditionalInfoFromMessage (update)) (
          getAdditionalInfoFromCallbackData (update),
        ),
      ),
      S.chain (validate (surveyAdditionalInfoRules)),
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
        }),
      ),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
