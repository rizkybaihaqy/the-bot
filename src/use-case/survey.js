import {insertOneToSurveys} from '../data-access/surveys'
import {S} from '../lib/sanctuary'

// StrMap String -> Future String String
export const addSurvey = S.pipe ([
  (x) => insertOneToSurveys (S.keys (x)) (S.values (x)),
  S.map (S.pipe ([ S.prop ('rows'), S.head, S.fromMaybe ({}) ])),
])
