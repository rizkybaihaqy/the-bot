import {JSONData} from '../../fluture'
import {S} from '../../sanctuary'
import {
  getBotCommandArgument,
  getNBotCommandArgumentsByNewLine,
} from '../getter'
import {
  reply,
  replyTo,
  replyWithInlineKeyboard,
} from '../request'

export const visitStart = S.pipe ([
  replyWithInlineKeyboard (
    'Please reply with the following format\n\nNama Pelanggan:\nE-Mail:\nCP Pelanggan:\nCP Alternative:\nODP Datek:\nODP Alternative 1:\nODP Alternative 2:\nIDP PLN:\nAlamat:\nKeterangan Paket:\nStatus Rumah:\nKeterangan:\n',
  ),
  S.map (JSONData),
])

export const visitReport = S.pipe ([
  (x) => (console.log ('hoho 🎅', x.body), x),
  reply ('working on visit report'),
  S.map (JSONData),
])
