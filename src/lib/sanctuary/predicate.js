import {S} from './instance'

export const isEmptyString = S.complement (
  S.equals (S.empty (String)),
)
