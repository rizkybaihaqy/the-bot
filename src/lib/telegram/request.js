import {TELEGRAM_API} from '../../constants/telegram'
import {eitherToFuture, flAxios} from '../fluture'
import {S} from '../sanctuary/instance'
import {getChatIdFromRequest} from './getter'

export const sendMessage = (chatId) => (text) =>
  flAxios (
    ('POST',
    {
      url: `${TELEGRAM_API}/sendMessage`,
      data: {
        chat_id: chatId,
        text: text,
      },
    }),
  )

export const reply = (msg) => (req) =>
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) => sendMessage (chatId) (msg)),
  ]) (req)

export const replyTo = (req) => (msg) => reply (msg) (req)
