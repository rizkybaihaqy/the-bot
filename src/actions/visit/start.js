import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  getEntityTextFromMessage,
  getMessageFromRequest,
} from '../../lib/telegram/getter'

// Req -> boolean
const isVisitStart = S.pipe ([
  getMessageFromRequest,
  S.chain (getEntityTextFromMessage ('bot_command')),
  S.map (S.equals ('/visit')),
  S.fromRight (false),
])

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isVisitStart) (
    S.pipe ([
      (_) => 'Which visit you want to report ?',
      locals.sendMessage ({
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
      }),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
