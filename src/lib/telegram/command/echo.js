import {Json} from 'fluture-express'
import {S} from '../../sanctuary/instance'
import {reply} from '../request'

export const echo = S.pipe ([
  reply ('echo'),
  S.map ((msg) => Json (msg.data)),
])
