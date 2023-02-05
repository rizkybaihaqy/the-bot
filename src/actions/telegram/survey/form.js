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
import {t} from '../../../translation'

// StrMap a
const surveyFormRules = S.pipe ([
  S.remove ('location'),
  S.remove ('reason'),
  S.remove ('additional_desc'),
]) (surveyRules)

// Req -> boolean
const isSurveyForm = S.pipe ([
  gets (['body', 'message']),
  S.chain (
    lift2_ (stripText) (get ('text')) (getEntity ('hashtag'))
  ),
  S.map (S.equals ('#SurveyForm')),
  S.fromMaybe (false),
])

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isSurveyForm) (
    S.pipe ([
      gets (['body', 'message', 'text']),
      S.map (textFormToStrMap),
      S.maybeToEither (t ('error_get_survey_form')),
      S.chain (validate (surveyFormRules)),
      S.map (strMapToTextForm),
      S.map (x => '#SurveyReason\n' + x),
      eitherToFuture,
      S.chain (
        locals.sendMessage ({
          inline_keyboard: [
            [
              {
                text: t ('msg_no_need_for_internet'),
                callback_data: 'no_need_for_internet',
              },
            ],
            [
              {
                text: t (
                  'msg_already_subscribe_to_competitor'
                ),
                callback_data:
                  'already_subscribe_to_competitor',
              },
            ],
            [
              {
                text: t ('msg_need_cheaper_package'),
                callback_data: 'need_cheaper_package',
              },
            ],
            [
              {
                text: t ('msg_unsubscribed_disappointed'),
                callback_data: 'unsubscribed_disappointed',
              },
            ],
            [
              {
                text: t ('msg_other'),
                callback_data: 'other',
              },
            ],
          ],
        })
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
