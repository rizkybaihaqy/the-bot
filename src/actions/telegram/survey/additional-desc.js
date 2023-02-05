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
import {alt_, lift2_} from '../../../lib/utils/function'
import {get, gets} from '../../../lib/utils/object'
import {validate} from '../../../lib/utils/validator'
import {surveyRules} from '../../../rules/survey'
import {t} from '../../../translation'

// StrMap a
const surveyAdditionalDescRules =
  S.remove ('location') (surveyRules)

// Req -> boolean
const isSurveyAdditionalDesc = S.pipe ([
  get ('body'),
  S.chain (
    alt_ (gets (['message', 'reply_to_message'])) (
      gets (['callback_query', 'message'])
    )
  ),
  S.chain (
    lift2_ (stripText) (get ('text')) (getEntity ('hashtag'))
  ),
  S.map (S.equals ('#SurveyAdditionalDesc')),
  S.fromMaybe (false),
])

const getAdditionalDescFromMessage = lift2_ (
  survey => additional_desc => ({
    ...survey,
    additional_desc,
  })
) (
  S.pipe ([
    gets (['message', 'reply_to_message', 'text']),
    S.map (textFormToStrMap),
  ])
) (gets (['message', 'text']))

const getAdditionalDescFromCallbackData = lift2_ (
  survey => additional_desc => ({
    ...survey,
    additional_desc,
  })
) (
  S.pipe ([
    gets (['callback_query', 'message', 'text']),
    S.map (textFormToStrMap),
  ])
) (gets (['callback_query', 'data']))

const surveyAdditionalDescTextGenerator = ({
  reason,
  additional_desc,
  ...survey
}) =>
  '#SurveyAdditionalDesc\n' +
  strMapToTextForm ({...survey, reason}) +
  (reason === 'already_subscribe_to_competitor'
    ? '\n' + t ('msg_who_is_the_competitor')
    : reason === 'need_cheaper_package'
    ? '\n' + t ('msg_whats_the_price_range')
    : '\n' + t ('msg_add_more_desc'))

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isSurveyAdditionalDesc) (
    S.pipe ([
      get ('body'),
      S.chain (
        alt_ (getAdditionalDescFromMessage) (
          getAdditionalDescFromCallbackData
        )
      ),
      S.maybeToEither (
        t ('error_get_survey_additional_desc')
      ),
      S.chain (validate (surveyAdditionalDescRules)),
      eitherToFuture,
      S.chain (
        S.ifElse (
          survey => survey.additional_desc === 'other'
        ) (
          S.pipe ([
            surveyAdditionalDescTextGenerator,
            locals.sendMessage ({
              force_reply: true,
              input_field_placeholder: t (
                'msg_add_more_desc'
              ),
            }),
          ])
        ) (
          S.pipe ([
            strMapToTextForm,
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
              input_field_placeholder: t (
                'msg_share_your_current_location'
              ),
              resize_keyboard: true,
            }),
          ])
        )
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
