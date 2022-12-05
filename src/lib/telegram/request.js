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
        reply_markup: {
          remove_keyboard: true,
        },
      },
    }),
  )

export const inlineKeyboard = (chatId) => (text) =>
  flAxios (
    ('POST',
    {
      url: `${TELEGRAM_API}/sendMessage`,
      data: {
        chat_id: chatId,
        text: text,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Report Visit',
                callback_data: 'visit_report',
              },
            ],
            [
              {
                text: 'Report Survey',
                callback_data: 'visit_survey',
              },
            ],
          ],
        },
      },
    }),
  )

export const requestLocation = (chatId) => (text) =>
  flAxios (
    ('POST',
    {
      url: `${TELEGRAM_API}/sendMessage`,
      data: {
        chat_id: chatId,
        text: `${text}\n Send Your Location`,
        reply_markup: {
          keyboard: [
            [
              {
                text: 'Send My Current Location',
                request_location: true,
              },
            ],
          ],
          one_time_keyboard: true,
        },
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

export const replyWithInlineKeyboard = (msg) => (req) =>
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) => inlineKeyboard (chatId) (msg)),
  ]) (req)

export const replyWithInlineKeyboardTo = (req) => (msg) =>
  inlineKeyboard (msg) (req)

export const replyRequestLocation = (msg) => (req) =>
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) => requestLocation (chatId) (msg)),
  ]) (req)

export const replyRequestLocationTo = (req) => (msg) =>
  replyRequestLocation (msg) (req)

export const reply = (msg) => (req) =>
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) => sendMessage (chatId) (msg)),
  ]) (req)

export const replyTo = (req) => (msg) => reply (msg) (req)
