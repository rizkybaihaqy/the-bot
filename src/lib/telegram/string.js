import {snakeCase} from 'change-case'
import {getOriginal} from '../../translation'
import {S} from '../sanctuary'

export const stripEntity =
  text =>
  ({offset, length}) =>
    text.slice (offset + length)

export const stripText =
  text =>
  ({offset, length}) =>
    text.slice (offset, offset + length)

// String -> Either String
export const textFormToStrMap = S.pipe ([
  S.lines,
  S.map (S.splitOn (':')),
  S.filter (x => x.length === 2),
  S.map (([key, value]) =>
    S.Pair (S.pipe ([snakeCase, getOriginal]) (key)) (
      S.trim (value)
    )
  ),
  S.fromPairs,
])
