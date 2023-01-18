import {Next} from 'fluture-express'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../../lib/fluture'
import {S} from '../../../lib/sanctuary'
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
} from '../../../lib/telegram/getter'
import {validate} from '../../../lib/utils/validator'
import {surveyRules} from '../../../rules/survey'

// StrMap a
const surveyAdditionalDescRules =
  S.remove ('location') (surveyRules)

// Req -> boolean
const isSurveyAdditionalDesc = S.pipe ([
  getUpdateFromRequest,
  S.chain (update =>
    S.alt (
      S.pipe ([
        getMessageFromUpdate,
        S.chain (getReplyMessageFromMessage),
      ]) (update)
    ) (
      S.pipe ([
        getCallbackQueryFromUpdate,
        S.chain (getMessageFromUpdate),
      ]) (update)
    )
  ),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#SurveyAdditionalDesc')),
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
    ]) (update)
  ) (
    S.pipe ([
      getMessageFromUpdate,
      S.chain (getTextFromMessage),
    ]) (update)
  )

const getAdditionalDescFromCallbackData = update =>
  S.lift2 (survey => additional_desc => ({
    ...survey,
    additional_desc,
  })) (
    S.pipe ([
      getCallbackQueryFromUpdate,
      S.chain (getMessageFromUpdate),
      S.chain (getTextFromMessage),
      S.map (getFormDataFromText),
    ]) (update)
  ) (
    S.pipe ([
      getCallbackQueryFromUpdate,
      S.chain (getDataFromCallbackQuery),
    ]) (update)
  )

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isSurveyAdditionalDesc) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (update =>
        S.alt (getAdditionalDescFromMessage (update)) (
          getAdditionalDescFromCallbackData (update)
        )
      ),
      S.chain (validate (surveyAdditionalDescRules)),
      eitherToFuture,
      S.chain (
        S.ifElse (
          survey => survey.additional_desc === 'other'
        ) (
          S.pipe ([
            getTextFromFormData,
            S.concat ('#SurveyOtherAdditionalDesc\n'),
            locals.sendMessage ({
              force_reply: true,
              input_field_placeholder:
                'Please provide more information',
            }),
          ])
        ) (
          S.pipe ([
            getTextFromFormData,
            S.concat ('#SurveyLocation\n'),
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
          ])
        )
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
