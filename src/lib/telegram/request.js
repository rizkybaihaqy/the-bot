import {TRACKER_API_KEY} from '../../constants/indohome'
import {TELEGRAM_API} from '../../constants/telegram'
import {flAxios} from '../fluture'

// ReplyMarkup -> String -> String -> Future Error Axios
export const sendMessage =
  (replyMarkup) => (chatId) => (text) =>
    flAxios (
      ('POST',
      {
        url: `${TELEGRAM_API}/sendMessage`,
        data: {
          chat_id: chatId,
          text: text,
          reply_markup: replyMarkup,
        },
      }),
    )

// String -> Future Error Axios
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
