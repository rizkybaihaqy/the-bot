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
  getTextFromFormData,
  getTextFromMessage,
  getUpdateFromRequest,
} from '../../../lib/telegram/getter'
import {validate} from '../../../lib/utils/validator'
import {surveyRules} from '../../../rules/survey'

// StrMap a
const surveyReasonRules = S.pipe ([
  S.remove ('location'),
  S.remove ('additional_desc'),
]) (surveyRules)

// Req -> boolean
const isSurveyReason = S.pipe ([
  getUpdateFromRequest,
  S.chain (getCallbackQueryFromUpdate),
  S.chain (getMessageFromUpdate),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#SurveyReason')),
  S.fromRight (false),
])

// StrMap SurveyReason -> String
const surveyReasonTextGenerator = ({reason, ...survey}) =>
  (reason === 'no_need_for_internet'
    ? '#SurveyLocation'
    : '#SurveyAdditionalDesc') +
  '\n' +
  getTextFromFormData ({...survey, reason}) +
  '\n' +
  (reason === 'no_need_for_internet'
    ? 'additional_desc: -'
    : reason === 'already_subscribe_to_competitor'
    ? 'Who is the competitor ?'
    : reason === 'need_cheaper_package'
    ? 'What is the price range ?'
    : 'Add more description !')

// String -> ReplyMarkup
const replyMarkup = reason =>
  reason === 'no_need_for_internet'
    ? {
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
      }
    : reason === 'already_subscribe_to_competitor'
    ? {
        inline_keyboard: [
          [
            {
              text: 'ICON+',
              callback_data: 'icon',
            },
          ],
          [
            {
              text: 'XLHome',
              callback_data: 'xl_home',
            },
          ],
          [
            {
              text: 'Other',
              callback_data: 'other',
            },
          ],
        ],
      }
    : reason === 'need_cheaper_package'
    ? {
        inline_keyboard: [
          [
            {
              text: '100K-200K',
              callback_data: '100K-200K',
            },
          ],
          [
            {
              text: '200K-300K',
              callback_data: '200K-300K',
            },
          ],
          [
            {
              text: 'Other',
              callback_data: 'other',
            },
          ],
        ],
      }
    : reason === 'unsubscribed_disappointed' ||
      reason === 'other'
    ? {
        force_reply: true,
        input_field_placeholder:
          'Please provide more information',
      }
    : {remove_keyboard: true}

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isSurveyReason) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (getCallbackQueryFromUpdate),
      S.chain (cbq =>
        S.lift2 (txt => reason => ({...txt, reason})) (
          S.pipe ([
            getMessageFromUpdate,
            S.chain (getTextFromMessage),
            S.map (getFormDataFromText),
          ]) (cbq)
        ) (getDataFromCallbackQuery (cbq))
      ),
      S.chain (validate (surveyReasonRules)),
      eitherToFuture,
      S.chain (survey =>
        locals.sendMessage (
          replyMarkup (S.prop ('reason') (survey))
        ) (surveyReasonTextGenerator (survey))
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
