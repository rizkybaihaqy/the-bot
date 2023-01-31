import {S} from '../sanctuary'

export const lift2_ = fn => fa => fb => data =>
  S.lift2 (fn) (fa (data)) (fb (data))

export const alt_ = fa => fb => data =>
  S.alt (fa (data)) (fb (data))
