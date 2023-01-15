import {capitalCase} from 'change-case'
import {S} from '../sanctuary'
import {objDiff} from './getter'

// StrMap F -> StrMap String -> Either String StrMap String
export const validate = rules =>
  S.ifElse (S.pipe ([objDiff (rules), x => x.length === 0])) (
    S.pipe ([S.ap (rules), S.sequence (S.Either)])
  ) (
    S.pipe ([
      objDiff (rules),
      S.map (capitalCase),
      x => 'Missing Field ' + x,
      S.Left,
    ])
  )
