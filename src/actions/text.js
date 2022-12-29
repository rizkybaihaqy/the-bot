import {JSONData, eitherToFuture} from '../lib/fluture'
import {S} from '../lib/sanctuary'
import {getTextFromRequest} from '../lib/telegram/getter'
import {reply} from '../lib/telegram/reply'

export default (_) => (req) =>
  S.pipe ([
    getTextFromRequest,
    S.map ((_) => 'Got Your Message'),
    eitherToFuture,
    S.chain (S.flip (reply) (req)),
    S.map (JSONData),
  ]) (req)
