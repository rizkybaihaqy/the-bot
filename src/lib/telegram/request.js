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

export const fetchTrackId = (myid) =>
  flAxios ({
    method: 'post',
    url: 'https://indihome.co.id/api/landing-page/digital-tracker',
    data: {
      guid: '',
      code: 0,
      data: {
        pApi: '54656c6b6f6d4d794358313233323032322d5365702d547565',
        trackId: myid,
      },
    },
  })

export const reply = (msg) => (req) =>
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) => sendMessage (chatId) (msg)),
  ]) (req)

export const replyTo = (req) => (msg) => reply (msg) (req)
