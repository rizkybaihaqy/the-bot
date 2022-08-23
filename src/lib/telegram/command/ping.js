import {eitherToFuture} from '../../fluture'
import {getChatIdFromRequest} from '../getter'
import {sendMessage} from '../request'
import {S} from '../../sanctuary/instance'
import {Json} from 'fluture-express'

export const ping = S.pipe ([
  getChatIdFromRequest,
  eitherToFuture,
  S.chain ((chatId) => sendMessage (chatId) ('pong')),
  S.map ((msg) => Json (msg.data)),
])
