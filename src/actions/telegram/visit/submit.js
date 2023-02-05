import {Next} from 'fluture-express'
import {
  F,
  JSONData,
  eitherToFuture,
} from '../../../lib/fluture'
import {S} from '../../../lib/sanctuary'
import {getEntity} from '../../../lib/telegram/object'
import {sendMessageToAdmin} from '../../../lib/telegram/request'
import {
  stripText,
  textFormToStrMap,
} from '../../../lib/telegram/string'
import {lift2_, lift3_} from '../../../lib/utils/function'
import {get, gets} from '../../../lib/utils/object'
import {validate} from '../../../lib/utils/validator'
import {visitRules} from '../../../rules/visit'
import {t} from '../../../translation'
import {
  addVisit,
  getVisitUpdate,
} from '../../../use-case/visit'

// Req -> boolean
const isVisitSubmit = S.pipe ([
  gets (['body', 'message', 'reply_to_message']),
  S.chain (
    lift2_ (stripText) (get ('text')) (getEntity ('hashtag'))
  ),
  S.map (S.equals ('#VisitSubmit')),
  S.fromMaybe (false),
])

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isVisitSubmit) (
    S.pipe ([
      gets (['body', 'message']),
      S.maybeToEither (t ('error_get_visit_submit')),
      S.chain (
        lift3_ (
          visitData => location => telegramId => ({
            ...visitData,
            location,
            telegram_id: telegramId,
          })
        ) (
          S.pipe ([
            gets (['reply_to_message', 'text']),
            S.map (textFormToStrMap),
            S.maybeToEither (t ('error_get_visit_data')),
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
            S.maybeToEither (t ('error_get_location')),
          ])
        ) (
          S.pipe ([
            gets (['from', 'id']),
            S.map (telegramId => telegramId.toString ()),
            S.maybeToEither (t ('error_get_telegram_id')),
          ])
        )
      ),
      S.chain (validate (visitRules)),
      eitherToFuture,
      S.chain (addVisit),
      S.chain (getVisitUpdate),
      S.chain (({user, todayVisit}) =>
        F.both (
          locals.sendMessage ({remove_keyboard: true}) (
            t ('msg_save_visit_report')
          )
        ) (
          sendMessageToAdmin (
            t ('msg_new_data_update') +
              ' ' +
              user.name +
              `(${user.sales_code})\n` +
              t ('msg_today_data_update') +
              ' ' +
              todayVisit
          )
        )
      ),
      S.map (x => x[1]),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
