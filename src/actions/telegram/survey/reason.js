import {Next} from 'fluture-express'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../../lib/fluture'
import {S} from '../../../lib/sanctuary'
import {getEntity} from '../../../lib/telegram/object'
import {
  stripText,
  textFormToStrMap,
} from '../../../lib/telegram/string'
import {strMapToTextForm} from '../../../lib/telegram/strmap'
import {lift2_} from '../../../lib/utils/function'
import {get, gets} from '../../../lib/utils/object'
import {validate} from '../../../lib/utils/validator'
import {surveyRules} from '../../../rules/survey'

// StrMap a
const surveyReasonRules = S.pipe ([
  S.remove ('location'),
  S.remove ('additional_desc'),
]) (surveyRules)

// Req -> boolean
const isSurveyReason = S.pipe ([
  gets (['body', 'callback_query', 'message']),
  S.chain (
    lift2_ (stripText) (get ('text')) (getEntity ('hashtag'))
  ),
  S.map (S.equals ('#SurveyReason')),
  S.fromMaybe (false),
])

// StrMap SurveyReason -> String
const surveyReasonTextGenerator = ({reason, ...survey}) =>
  (reason === 'no_need_for_internet'
    ? '#SurveyLocation'
    : '#SurveyAdditionalDesc') +
  '\n' +
  strMapToTextForm ({...survey, reason}) +
  (reason === 'no_need_for_internet'
    ? 'deskripsi_tambahan: -'
    : reason === 'already_subscribe_to_competitor'
    ? '\nSiapa Kompetitornya ?'
    : reason === 'need_cheaper_package'
    ? '\nBerapa range harganya ?'
    : '\nTambahkan deskripsi !')

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
      gets (['body', 'callback_query']),
      S.maybeToEither ('Cannot get survey reason'),
      S.chain (
        lift2_ (txt => reason => ({...txt, reason})) (
          S.pipe ([
            gets (['message', 'text']),
            S.map (textFormToStrMap),
            S.maybeToEither ('Cannot get survey data'),
          ])
        ) (
          S.pipe ([
            get ('data'),
            S.maybeToEither ('Cannot get survey reason'),
          ])
        )
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
