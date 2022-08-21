import {Json} from 'fluture-express'
import {eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary/instance'
import {getChatIdFromRequest} from '../lib/telegram/getter'
import {sendMessage} from '../lib/telegram/request'

export default (_) => (req) =>
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) =>
      sendMessage (chatId) ('Got Your Message'),
    ),
    S.map ((msg) => Json (msg.data)),
  ]) (req)
