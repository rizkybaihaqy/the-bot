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
  getMessageFromUpdate,
  getTextFromFormData,
  getTextFromMessage,
  getUpdateFromRequest,
} from '../../../lib/telegram/getter'
import {validate} from '../../../lib/utils/validator'
import {surveyRules} from '../../../rules/survey'

// StrMap a
const surveyFormRules = S.pipe ([
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

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isSurveyForm) (
    S.pipe ([
      getUpdateFromRequest,
      S.chain (getMessageFromUpdate),
      S.chain (getTextFromMessage),
      S.map (getFormDataFromText),
      S.chain (validate (surveyFormRules)),
      S.map (getTextFromFormData),
      S.map (x => '#SurveyReason\n' + x),
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
        })
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
