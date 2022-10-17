import {JSONData, eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {getTextFromRequest} from '../lib/telegram/getter'
import {replyTo} from '../lib/telegram/request'

export default (_) => (req) =>
  S.pipe ([
    getTextFromRequest,
    S.map ((_) => 'Got Your Message'),
    eitherToFuture,
    S.chain (replyTo (req)),
    S.map (JSONData),
  ]) (req)
