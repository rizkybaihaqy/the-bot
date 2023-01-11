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
  getReplyMessageFromMessage,
  getTextFromMessage,
  getUpdateFromRequest,
} from '../../lib/telegram/getter'

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
  S.lift2 ((txt) => (additionalDesc) => ({
    txt,
    additionalDesc,
  })) (
    S.pipe ([
      getMessageFromUpdate,
      S.chain (getReplyMessageFromMessage),
      S.chain (getTextFromMessage),
    ]) (update),
  ) (
    S.pipe ([
      getMessageFromUpdate,
      S.chain (getTextFromMessage),
    ]) (update),
  )

const getAdditionalInfoFromCallbackData = (update) =>
  S.lift2 ((txt) => (additionalDesc) => ({
    txt,
    additionalDesc,
  })) (
    S.pipe ([
      getCallbackQueryFromUpdate,
      S.chain (getMessageFromUpdate),
      S.chain (getTextFromMessage),
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
      S.map (
        ({txt, additionalDesc}) =>
          txt.replace (
            '#SurveyAdditionalInfo',
            '#SurveyLocation',
          ) +
          '\nadditional desc:' +
          additionalDesc,
      ),
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
