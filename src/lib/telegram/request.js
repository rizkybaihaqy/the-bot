import {TRACKER_API_KEY} from '../../constants/indohome'
import {TELEGRAM_API} from '../../constants/telegram'
import {eitherToFuture, flAxios} from '../fluture'
import {S} from '../sanctuary'
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
        pApi: TRACKER_API_KEY,
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
