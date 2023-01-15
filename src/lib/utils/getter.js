import {formatISO9075} from 'date-fns'
import {utcToZonedTime} from 'date-fns-tz'
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

// StrMap -> StrMap -> Array String
export const objDiff = base => comparator =>
  arrayDiff (S.keys (base)) (S.keys (comparator))

// Array String -> Array String -> Boolean
export const sameValues = arr => brr =>
  arr.length === brr.length &&
  arr.every (brr.includes)

export const dateToStringWithTZ = S.compose (formatISO9075) (
  isoDate => utcToZonedTime (isoDate, 'Asia/Jakarta')
)

export const now = dateToStringWithTZ (new Date ())
