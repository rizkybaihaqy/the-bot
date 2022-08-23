import { Json } from 'fluture-express'
import { S } from '../lib/sanctuary/instance'
import { reply } from '../lib/telegram/request'

export default (_) => (req) =>
  S.pipe ([
    reply ('Got Your Message'),
    S.map ((msg) => Json (msg.data)),
  ]) (req)
