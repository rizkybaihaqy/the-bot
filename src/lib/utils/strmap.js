import {S} from '../sanctuary'
import {arrayDiff} from './array'

// StrMap -> StrMap -> Array String
export const objDiff = base => comparator =>
  arrayDiff (S.keys (base)) (S.keys (comparator))
