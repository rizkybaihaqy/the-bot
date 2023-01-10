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
  getMessageFromUpdate,
  getTextFromMessage,
  getUpdateFromRequest,
} from '../../lib/telegram/getter'

// Req -> boolean
const isSurveyReason = S.pipe ([
  getUpdateFromRequest,
  S.chain (getCallbackQueryFromUpdate),
  S.chain (getMessageFromUpdate),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#SurveyReason')),
  S.fromRight (false),
])

// String -> ReplyMarkup
const replyMarkup = (reason) =>
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
export default (locals) =>
  S.ifElse (isSurveyReason) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (getCallbackQueryFromUpdate),
      S.chain ((cbq) =>
        S.lift2 ((txt) => (reason) => ({txt, reason})) (
          S.pipe ([
            getMessageFromUpdate,
            S.chain (getTextFromMessage),
          ]) (cbq),
        ) (getDataFromCallbackQuery (cbq)),
      ),
      eitherToFuture,
      S.chain (({txt, reason}) =>
        locals.sendMessage (replyMarkup (reason)) (
          txt.replace (
            '#SurveyReason',
            reason === 'no_need_for_internet'
              ? '#SurveyLocation'
              : '#SurveyAdditionalInfo',
          ) +
            '\nreason:' +
            reason +
            '\n\nTambahkan Alasan!',
        ),
      ),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
