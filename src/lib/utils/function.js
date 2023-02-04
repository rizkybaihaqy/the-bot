import {S} from '../sanctuary'

export const lift2_ = fn => fa => fb => data =>
  S.lift2 (fn) (fa (data)) (fb (data))

export const lift3_ =
  fn => fa => fb => fc => data =>
    S.lift3 (fn) (fa (data)) (fb (data)) (fc (data))

export const alt_ = fa => fb => data =>
  S.alt (fa (data)) (fb (data))

export const tagByWithMessage = left => predicate =>
  S.ifElse (predicate) (S.Right) (S.K (S.Left (left)))
