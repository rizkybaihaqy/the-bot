import {Redirect} from 'fluture-express'
import $ from 'sanctuary-def'
import {maybeToFuture} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {
  deleteWebhook,
  setWebhook,
} from '../../lib/telegram/request'

export default locals =>
  S.pipe ([
    S.prop ('body'),
    S.get (S.is ($.String)) ('toggle'),
    maybeToFuture,
    S.chain (x =>
      x === 'set' ? setWebhook : deleteWebhook
    ),
    S.map (_ => Redirect ('/')),
  ])
