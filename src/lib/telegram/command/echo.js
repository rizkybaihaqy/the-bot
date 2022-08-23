import {Json} from 'fluture-express'
import {eitherToFuture} from '../../fluture'
import {getChatIdFromRequest} from '../getter'
import {sendMessage} from '../request'
import {S} from '../../sanctuary/instance'

export const echo = S.pipe ([
  getChatIdFromRequest,
  eitherToFuture,
  S.chain ((chatId) => sendMessage (chatId) ('echo')),
  S.map ((msg) => Json (msg.data)),
])
