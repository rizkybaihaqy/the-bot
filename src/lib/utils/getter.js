import {S} from '../sanctuary'

export const getArrayElement = (i) =>
  S.pipe ([
    (arr) => arr[i],
    (elm) => (elm != null ? S.Just (elm) : S.Nothing),
  ])

// Array a -> Array a
export const tailReversed = S.pipe ([
  S.reverse,
  S.tail,
  S.fromMaybe ([]),
  S.reverse,
])
