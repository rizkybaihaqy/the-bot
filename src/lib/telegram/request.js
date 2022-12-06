import {TRACKER_API_KEY} from '../../constants/indohome'
import {TELEGRAM_API} from '../../constants/telegram'
import {eitherToFuture, flAxios} from '../fluture'
import {S} from '../sanctuary'
import {
  getChatIdFromCallbackQueryRequest,
  getChatIdFromRequest,
} from './getter'

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

export const forceReply = (chatId) => (text) =>
  flAxios (
    ('POST',
    {
      url: `${TELEGRAM_API}/sendMessage`,
      data: {
        chat_id: chatId,
        text: text,
        reply_markup: {
          force_reply: true,
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

export const replyForceReply = (msg) => (req) =>
  S.pipe ([
    getChatIdFromCallbackQueryRequest,
    eitherToFuture,
    S.chain ((chatId) => forceReply (chatId) (msg)),
  ]) (req)

export const replyForceReplyTo = (req) => (msg) =>
  replyForceReply (msg) (req)

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

export const replyCallbackQuery = (msg) => (req) =>
  S.pipe ([
    getChatIdFromCallbackQueryRequest,
    eitherToFuture,
    S.chain ((chatId) => sendMessage (chatId) (msg)),
  ]) (req)

export const replyCallbackQueryTo = (req) => (msg) =>
  replyCallbackQuery (req) (msg)

export const reply = (msg) => (req) =>
  S.pipe ([
    getChatIdFromRequest,
    eitherToFuture,
    S.chain ((chatId) => sendMessage (chatId) (msg)),
  ]) (req)

export const replyTo = (req) => (msg) => reply (msg) (req)
