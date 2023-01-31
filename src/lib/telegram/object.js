import {S} from '../sanctuary'
import {get} from '../utils/object'

export const getEntity = type =>
  S.pipe ([
    get ('entities'),
    S.chain (S.find (x => x.type === type)),
  ])
