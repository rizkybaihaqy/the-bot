import { Json } from 'fluture-express'
import { S } from '../../sanctuary/instance'
import { reply } from '../request'

export const ping = S.pipe ([
  reply ('pong'),
  S.map ((msg) => Json (msg.data)),
])
