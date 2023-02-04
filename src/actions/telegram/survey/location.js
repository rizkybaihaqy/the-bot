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
import {lift2_} from '../../../lib/utils/function'
import {get, gets} from '../../../lib/utils/object'
import {validate} from '../../../lib/utils/validator'
import {surveyRules} from '../../../rules/survey'
import {addSurvey} from '../../../use-case/survey'

// Req -> boolean
const isSurveyLocation = S.pipe ([
  gets (['body', 'message', 'reply_to_message']),
  S.chain (
    lift2_ (stripText) (get ('text')) (getEntity ('hashtag'))
  ),
  S.map (S.equals ('#SurveyLocation')),
  S.fromMaybe (false),
])

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isSurveyLocation) (
    S.pipe ([
      gets (['body', 'message']),
      S.maybeToEither ('Cannot get survey location'),
      S.chain (
        lift2_ (visitData => location => ({
          ...visitData,
          location,
        })) (
          S.pipe ([
            gets (['reply_to_message', 'text']),
            S.map (textFormToStrMap),
            S.maybeToEither ('Cannot get survey data'),
          ])
        ) (
          S.pipe ([
            get ('location'),
            S.chain (
              lift2_ (lat => lng => [lat, lng]) (
                get ('latitude')
              ) (get ('longitude'))
            ),
            S.map (location => location.toString ()),
            S.maybeToEither ('Cannot to get location'),
          ])
        )
      ),
      S.chain (validate (surveyRules)),
      eitherToFuture,
      S.chain (addSurvey),
      S.chain (_ =>
        locals.sendMessage ({remove_keyboard: true}) (
          'Data Berhasil di input'
        )
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
