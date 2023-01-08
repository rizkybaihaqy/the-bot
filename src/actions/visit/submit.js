import {capitalCase, snakeCase} from 'change-case'
import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData, eitherToFuture} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getLocationFromMessage,
  getMessageFromRequest,
  getReplyMessageFromMessage,
  getTelegramIdFromMessage,
  getTextFromMessage,
} from '../../lib/telegram/getter'
import {sendMessageToAdmin} from '../../lib/telegram/request'
import {objDiff} from '../../lib/utils/getter'
import {isEmptyString} from '../../lib/utils/predicate'
import {addVisit} from '../../use-case/visit'

// Req -> boolean
const isVisitSubmit = S.pipe ([
  getMessageFromRequest,
  S.chain (getReplyMessageFromMessage),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#VisitSubmit')),
  S.fromRight (false),
])

const validator = {
  track_id: S.tagBy (S.complement (isEmptyString)),
  customer_name: S.tagBy (S.complement (isEmptyString)),
  customer_email: S.tagBy (S.complement (isEmptyString)),
  customer_cp: S.tagBy (S.complement (isEmptyString)),
  customer_alt_cp: S.tagBy (S.complement (isEmptyString)),
  odp_datek: S.tagBy (S.complement (isEmptyString)),
  odp_alternative_1: S.tagBy (S.complement (isEmptyString)),
  odp_alternative_2: S.tagBy (S.complement (isEmptyString)),
  id_pln: S.tagBy (S.complement (isEmptyString)),
  address: S.tagBy (S.complement (isEmptyString)),
  package_desc: S.tagBy (S.complement (isEmptyString)),
  home_state: S.tagBy (S.complement (isEmptyString)),
  additional_desc: S.tagBy (S.complement (isEmptyString)),
}

// StrMap -> Either String StrMap
const validateUserInput = S.ifElse (
  S.pipe ([ objDiff (validator), (x) => x.length === 0 ]),
) (S.pipe ([ S.ap (validator), S.sequence (S.Either) ])) (
  S.pipe ([
    objDiff (validator),
    S.map (capitalCase),
    (x) => 'Missing Field ' + x,
    S.Left,
  ]),
)

// Message -> Either String Array String
const getVisitDataFromReplyMessage = S.pipe ([
  getReplyMessageFromMessage,
  S.chain (getTextFromMessage),
  S.map (S.lines),
  S.map (S.map (S.splitOn (':'))),
  S.map (S.filter ((x) => x.length === 2)),
  S.map (
    S.map (([ key, value ]) =>
      S.Pair (snakeCase (key)) (S.trim (value)),
    ),
  ),
  S.map (S.fromPairs),
  S.chain (validateUserInput),
  S.map (S.pairs),
  S.map (S.map (S.snd)),
])

// Message -> Either String Array String
const getUserInput = (msg) =>
  S.lift3 ((x) => (y) => (z) => [ ...x, y, z ]) (
    getVisitDataFromReplyMessage (msg),
  ) (getLocationFromMessage (msg)) (
    getTelegramIdFromMessage (msg),
  )

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isVisitSubmit) (
    S.pipe ([
      getMessageFromRequest,
      S.chain (getUserInput),
      eitherToFuture,
      S.chain (addVisit),
      S.chain ((msg) =>
        F.both (
          locals.sendMessage ({remove_keyboard: true}) (
            'Data Berhasil di input',
          ),
        ) (sendMessageToAdmin ('Ada inputan baru')),
      ),
      S.map ((x) => x[1]),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
