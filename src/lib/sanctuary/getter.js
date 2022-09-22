import {S} from './instance'

export const getArrayElement = (i) =>
  S.pipe ([
    (arr) => arr[i],
    (elm) => (elm != null ? S.Just (elm) : S.Nothing),
  ])
