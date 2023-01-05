import F from 'fluture'
import {Next} from 'fluture-express'
import {toSnakeCase} from 'js-convert-case'
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

// StrMap -> Either String StrMap
const validateUserInput = S.pipe ([
  S.ap ({
    track_id: S.tagBy (S.complement (isEmptyString)),
    nama_pelanggan: S.tagBy (S.complement (isEmptyString)),
    email: S.tagBy (S.complement (isEmptyString)),
    cp_pelanggan: S.tagBy (S.complement (isEmptyString)),
    cp_alternative: S.tagBy (S.complement (isEmptyString)),
    odp_datek: S.tagBy (S.complement (isEmptyString)),
    odp_alternative_1: S.tagBy (S.complement (isEmptyString)),
    odp_alternative_2: S.tagBy (S.complement (isEmptyString)),
    id_pln: S.tagBy (S.complement (isEmptyString)),
    alamat: S.tagBy (S.complement (isEmptyString)),
    keterangan_paket: S.tagBy (S.complement (isEmptyString)),
    status_rumah: S.tagBy (S.complement (isEmptyString)),
    keterangan: S.tagBy (S.complement (isEmptyString)),
  }),
  S.sequence (S.Either),
])

// Message -> Either String Array String
const getVisitDataFromReplyMessage = S.pipe ([
  getReplyMessageFromMessage,
  S.chain (getTextFromMessage),
  S.map (S.lines),
  S.map (S.map (S.splitOn (':'))),
  S.map (S.filter ((x) => x.length === 2)),
  S.map (
    S.map (([ key, value ]) =>
      S.Pair (toSnakeCase (key)) (S.trim (value)),
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
