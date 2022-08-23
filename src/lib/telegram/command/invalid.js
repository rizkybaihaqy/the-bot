import {Json} from 'fluture-express'
import {S} from '../../sanctuary/instance'
import {reply} from '../request'

export const invalid = S.pipe ([
  reply ('Invalid Bot Command'),
  S.map ((msg) => Json (msg.data)),
])
