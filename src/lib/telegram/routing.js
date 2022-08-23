import {Json} from 'fluture-express'
import {eitherToFuture} from '../fluture'
import {S} from '../sanctuary/instance'
import {getChatIdFromRequest} from './getter'
import {sendMessage} from './request'

export const command = (req) => (cmd) =>
  cmd === '/ping'
    ? S.pipe ([
        getChatIdFromRequest,
        eitherToFuture,
        S.chain ((chatId) => sendMessage (chatId) ('pong')),
        S.map ((msg) => Json (msg.data)),
      ]) (req)
  : cmd === '/echo'
    ? S.pipe ([
        getChatIdFromRequest,
        eitherToFuture,
        S.chain ((chatId) => sendMessage (chatId) ('echo')),
        S.map ((msg) => Json (msg.data)),
      ]) (req)
  : S.pipe ([
        getChatIdFromRequest,
        eitherToFuture,
        S.chain ((chatId) =>
          sendMessage (chatId) ('Invalid Bot Command'),
        ),
        S.map ((msg) => Json (msg.data)),
      ]) (req)
