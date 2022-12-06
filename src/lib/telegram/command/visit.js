import {JSONData} from '../../fluture'
import {S} from '../../sanctuary'
import {reply, replyWithInlineKeyboard} from '../reply'

export const visitStart = S.pipe ([
  replyWithInlineKeyboard ([
    [
      {
        text: 'Report Visits',
        switch_inline_query_current_chat:
          '\n#VisitReport\nTrackID:\nNama Pelanggan:\nE-Mail:\nCP Pelanggan:\nCP Alternative:\nODP Datek:\nODP Alternative 1:\nODP Alternative 2:\nIDP PLN:\nAlamat:\nKeterangan Paket:\nStatus Rumah:\nKeterangan:',
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

export const visitReport = S.pipe ([
  (x) => (console.log (x), x),
  reply ('Working On Visit Report'),
  S.map (JSONData),
])
