import {
  ADMIN_TELEGRAM_ID,
  SERVER_URL,
  TOKEN,
  TRACKER_API_KEY,
} from '../../config'
import {flAxios} from '../fluture'

const TELEGRAM_URL = `https://api.telegram.org/bot${TOKEN}`

// ReplyMarkup -> String -> String -> Future Error Axios
export const sendMessage =
  chatId => replyMarkup => text =>
    flAxios (
      ('POST',
      {
        url: `${TELEGRAM_URL}/sendMessage`,
        data: {
          chat_id: chatId,
          text: text,
          reply_markup: replyMarkup,
        },
      })
    )

// Future Error Axios
export const getWebhookInfo = flAxios ({
  method: 'POST',
  url: `${TELEGRAM_URL}/getWebhookInfo`,
})

// Future Error Axios
export const setWebhook = flAxios ({
  method: 'POST',
  url: `${TELEGRAM_URL}/setWebhook`,
  data: {
    url: `${SERVER_URL}/webhook/${TOKEN}`,
    drop_pending_updates: true,
  },
})

// Future Error Axios
export const deleteWebhook = flAxios ({
  method: 'POST',
  url: `${TELEGRAM_URL}/deleteWebhook`,
  data: {
    url: `${SERVER_URL}/webhook/${TOKEN}`,
    drop_pending_updates: true,
  },
})

// Future Error Axios
export const getMe = flAxios ({
  method: 'POST',
  url: `${TELEGRAM_URL}/getMe`,
})

// String -> Future Error Axios
export const sendMessageToAdmin = sendMessage (
  ADMIN_TELEGRAM_ID
) ({remove_keyboard: true})

// String -> Future Error Axios
export const fetchTrackId = myid =>
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
