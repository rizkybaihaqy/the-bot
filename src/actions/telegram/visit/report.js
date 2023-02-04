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
import {visitRules} from '../../../rules/visit'

// StrMap a
const visitRulesWithoutLocationTelegramId = S.pipe ([
  S.remove ('location'),
  S.remove ('telegram_id'),
]) (visitRules)

// Req -> boolean
const isVisitReport = S.pipe ([
  gets (['body', 'message']),
  S.chain (
    lift2_ (stripText) (get ('text')) (getEntity ('hashtag'))
  ),
  S.map (S.equals ('#VisitReport')),
  S.fromMaybe (false),
])

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isVisitReport) (
    S.pipe ([
      gets (['body', 'message', 'text']),
      S.map (textFormToStrMap),
      S.maybeToEither ('Cannot get visit report'),
      S.chain (
        validate (visitRulesWithoutLocationTelegramId)
      ),
      S.map (strMapToTextForm),
      S.map (x => '#VisitSubmit\n' + x),
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
            'Share lokasi anda saat ini',
          resize_keyboard: true,
        })
      ),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
