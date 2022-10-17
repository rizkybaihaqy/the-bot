import {S} from '../sanctuary'

export const isEmptyString = S.complement (
  S.equals (S.empty (String)),
)
