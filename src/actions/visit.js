import F from 'fluture'
import {Next} from 'fluture-express'
import {getSalesByTelegramId} from '../data-access/sales'
import {insertOneToVisits} from '../data-access/visits'
import {JSONData, eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getChatIdFromMessage,
  getEntityTextFromMessage,
  getLocationFromMessage,
  getMessageFromRequest,
  getReplyMessageFromMessage,
  getTextFromMessage,
} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

// Req -> boolean
const isVisitStart = S.pipe ([
  getMessageFromRequest,
  S.chain (getEntityTextFromMessage ('bot_command')),
  S.map (S.equals ('/visit')),
  S.fromRight (false),
])

// Req -> boolean
const isVisitReport = S.pipe ([
  getMessageFromRequest,
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#VisitReport')),
  S.fromRight (false),
])

// Req -> boolean
const isVisitSubmit = S.pipe ([
  getMessageFromRequest,
  S.chain (getReplyMessageFromMessage),
  S.chain (getEntityTextFromMessage ('hashtag')),
  S.map (S.equals ('#VisitSubmit')),
  S.fromRight (false),
])

// Message -> Either String Array
const getVisitDataFromReplyMessage = S.pipe ([
  getReplyMessageFromMessage,
  S.chain (getTextFromMessage),
  S.map (S.lines),
  S.map (S.map (S.splitOn (':'))),
  S.map (S.filter ((x) => x.length === 2)),
  S.map (S.map ((x) => S.Pair (x[0]) (x[1]))),
  S.map (S.map (S.snd)),
  S.map (S.map (S.trim)),
])

// Message -> Either String Array
const getVisitDataAndLocation = (msg) =>
  S.lift2 ((x) => (y) => [ ...x, y ]) (
    getVisitDataFromReplyMessage (msg),
  ) (getLocationFromMessage (msg))

// Message -> Future Error String
const getSalesIdFromTelegramId = S.pipe ([
  getChatIdFromMessage,
  eitherToFuture,
  S.chain (getSalesByTelegramId),
  S.chain (
    S.ifElse ((x) => x.rowCount === 0) ((_) =>
      F.reject ('No Sales Found With This Telegram Account'),
    ) ((x) => F.resolve (x.rows[0].id.toString ())),
  ),
])

// Message -> Future Error Array
const getVisitDataLocationAndSalesId = S.pipe ([
  (msg) =>
    F.both (
      S.pipe ([ getVisitDataAndLocation, eitherToFuture ]) (
        msg,
      ),
    ) (getSalesIdFromTelegramId (msg)),
  S.map (([ visitAndLocation, salesId ]) => [
    ...visitAndLocation,
    salesId,
  ]),
])

// Locals -> Req -> Future Error Axios
const visitStart = (locals) =>
  S.pipe ([
    (_) => 'Which visit you want to report',
    sendMessage ({
      inline_keyboard: [
        [
          {
            text: 'Report Visits',
            switch_inline_query_current_chat:
              '\n#VisitReport\nTrackID:\nNama Pelanggan:\nE-Mail:\nCP Pelanggan:\nCP Alternative:\nODP Datek:\nODP Alternative 1:\nODP Alternative 2:\nID PLN:\nAlamat:\nKeterangan Paket:\nStatus Rumah:\nKeterangan:',
          },
        ],
        [
          {
            text: 'Report Survey',
            callback_data: 'visit_survey',
          },
        ],
      ],
    }) (S.prop ('chatId') (locals)),
    S.map (JSONData),
  ])

// Locals -> Req -> Future Error Axios
const visitReport = (locals) =>
  S.pipe ([
    getMessageFromRequest,
    S.chain (getTextFromMessage),
    S.map ((text) =>
      text.replace ('#VisitReport', '#VisitSubmit'),
    ),
    eitherToFuture,
    S.chain (
      sendMessage ({
        keyboard: [
          [
            {
              text: 'Send Location',
              request_location: true,
            },
          ],
        ],
      }) (S.prop ('chatId') (locals)),
    ),
    S.map (JSONData),
  ])

// Locals -> Req -> Future Error Axios
const visitSubmit = (locals) =>
  S.pipe ([
    getMessageFromRequest,
    eitherToFuture,
    S.chain (getVisitDataLocationAndSalesId),
    S.chain (insertOneToVisits),
    S.chain (
      sendMessage ({remove_keyboard: true}) (
        S.prop ('chatId') (locals),
      ),
    ),
    S.map (JSONData),
  ])

export default (locals) => (req) =>
  isVisitStart (req)
    ? visitStart (locals) (req)
    : isVisitReport (req)
    ? visitReport (locals) (req)
    : isVisitSubmit (req)
    ? visitSubmit (locals) (req)
    : F.resolve (Next (locals))
