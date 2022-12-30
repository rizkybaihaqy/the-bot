import {pgFlQuery} from '../../../db/instance'
import {insertTo} from '../../../db/query'
import {JSONData, eitherToFuture} from '../../fluture'
import {F} from '../../fluture'
import {S} from '../../sanctuary'
import {
  getChatIdFromRequest,
  getMessageFromRequest,
  getReplyMessageFromRequest,
  getTextFromMessage,
  getTextFromRequest,
} from '../getter'
import {
  reply,
  replyWithInlineKeyboard,
  replyWithKeyboard,
} from '../reply'

const insertToVisit = insertTo ('visits')
const insertToVisitOrdered = insertToVisit ([
  'track_id',
  'customer_name',
  'customer_email',
  'customer_cp',
  'customer_alt_cp',
  'odp_datek',
  'odp_alternative_1',
  'odp_alternative_2',
  'id_pln',
  'address',
  'package_desc',
  'home_state',
  'additional_desc',
  'sales_id',
])

export const visitStart = S.pipe ([
  replyWithInlineKeyboard ([
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
  ]) ('Which visit you want to report'),
  S.map (JSONData),
])

const getVisitData = S.pipe ([
  getReplyMessageFromRequest,
  S.chain (getTextFromMessage),
  S.map (S.lines),
  S.map (S.map (S.splitOn (':'))),
  S.map (S.filter ((x) => x.length === 2)),
  S.map (S.map ((x) => S.Pair (x[0]) (x[1]))),
  S.map (S.map (S.snd)),
  S.map (S.map (S.trim)),
  eitherToFuture,
])

const getSalesIdFromTelegramId = S.pipe ([
  getChatIdFromRequest,
  eitherToFuture,
  S.chain ((telegramId) =>
    pgFlQuery ({
      name: 'select one sales by telegram id',
      text: 'SELECT id FROM sales WHERE telegram_id=$1',
      values: [telegramId],
    }),
  ),
  S.chain (
    S.ifElse ((x) => x.rowCount === 0) ((_) =>
      F.reject ('No Sales Found With This Telegram Account'),
    ) ((x) => F.resolve (x.rows[0].id.toString ())),
  ),
  S.map ((x) => [x]),
])

export const visitReport = (req) =>
  S.pipe ([
    getTextFromRequest,
    S.map ((text) =>
      text.replace ('#VisitReport', '#SubmitReport'),
    ),
    eitherToFuture,
    S.chain (
      S.flip (
        replyWithKeyboard ([
          [
            {
              text: 'Send Location',
              request_location: true,
            },
          ],
        ]),
      ) (req),
    ),
    S.map (JSONData),
  ]) (req)

export const submitReport = (req) =>
  S.pipe ([
    (x) =>
      F.both (getVisitData (x)) (getSalesIdFromTelegramId (x)),
    S.map (S.join),
    S.map ((x) => [x]),
    S.map (insertToVisitOrdered),
    S.chain (pgFlQuery),
    S.map ((x) => x.rows[0]),
    S.chain (S.flip (reply) (req)),
    S.map (JSONData),
  ]) (req)
