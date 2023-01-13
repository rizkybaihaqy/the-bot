import {flDetaBase} from '../../db/deta-base'
import {S} from '../../lib/sanctuary/'
import {sameValues} from '../../lib/utils/getter'
import Survey from '../../models/Survey'

// StrMap String -> Future Error Survey
export const insertOneToSurveys = (data) =>
  sameValues (S.keys (data)) (Survey)
    ? flDetaBase ('survey') ('put') (data)
    : F.reject ('Wrong query columns')

// Array StrMap String -> Future Error Array Survey
export const insertManyToSurveys = (data) =>
  S.all ((x) => sameValues (Survey) (S.keys (x))) (data)
    ? S.pipe ([
        flDetaBase ('survey') ('putMany'),
        S.map (S.props ([ 'processed', 'items' ])),
      ]) (data)
    : F.reject ('Wrong query columns Survey')
