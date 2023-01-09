import {Next} from 'fluture-express'
import {F, JSONData} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {
  getMessageFromRequest,
  getTextFromMessage,
} from '../lib/telegram/getter'

const isCancel = S.pipe ([
  getMessageFromRequest,
  S.chain (getTextFromMessage),
  S.map ((x) => S.equals ('cancel') (S.toLower (x))),
  S.fromRight (false),
])

export default (locals) => (req) =>
  S.ifElse (isCancel) (
    S.pipe ([
      (_) => 'Operation Canceled',
      locals.sendMessage ({remove_keyboard: true}),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals))) (req)
