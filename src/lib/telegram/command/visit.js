import {JSONData} from '../../fluture'
import {S} from '../../sanctuary'
import {
  reply,
  replyCallbackQuery,
  replyForceReply,
  replyWithInlineKeyboard,
} from '../request'

export const visitStart = S.pipe ([
  replyWithInlineKeyboard ('Which visit you want to report'),
  S.map (JSONData),
])

export const visitReport = S.pipe ([
  x => (console.log (x), x),
  reply ('Working On Visit Report'),
  S.map (JSONData),
])
