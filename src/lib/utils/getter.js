import {S} from '../sanctuary'

export const getArrayElement = (i) =>
  S.pipe ([
    (arr) => arr[i],
    (elm) => (elm != null ? S.Just (elm) : S.Nothing),
  ])
