import $ from 'sanctuary-def'
import {S} from '../sanctuary'
import {arrayDiff} from './array'

export const get = S.get (S.is ($.Any))
export const gets = S.gets (S.is ($.Any))

// Object -> Object -> Array String
export const objDiff = base => comparator =>
  arrayDiff (S.keys (base)) (S.keys (comparator))
