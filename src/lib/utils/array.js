import {S} from '../sanctuary'

export const getArrayElement = i =>
  S.pipe ([
    arr => arr[i],
    elm => (elm != null ? S.Just (elm) : S.Nothing),
  ])

// Array a -> Array a
export const tailReversed = S.pipe ([
  S.reverse,
  S.tail,
  S.fromMaybe ([]),
  S.reverse,
])

// Array a -> Array a -> Array a
export const arrayDiff = base => comparator =>
  S.filter (S.complement (S.flip (S.elem) (comparator))) (base)

// Array String -> Array String -> Boolean
export const sameValues = arr => brr =>
  arr.length === brr.length &&
  // eslint-disable-next-line functional/prefer-tacit
  arr.every (item => brr.includes (item))
