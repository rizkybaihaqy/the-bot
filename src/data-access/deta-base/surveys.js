import {flDetaBase} from '../../db/deta-base'
import {F} from '../../lib/fluture/'
import {S} from '../../lib/sanctuary/'
import {sameValues} from '../../lib/utils/getter'
import Survey from '../../models/Survey'

// StrMap String -> Future Error Survey
export const insertOneToSurveys = data =>
  sameValues (S.keys (data)) (Survey)
    ? S.pipe ([
        data => ({type: 'surveys', data}),
        flDetaBase ('put'),
        S.map (S.prop ('data')),
      ]) (data)
    : F.reject ('Wrong query columns Surveys')

// Empty -> Future Error Array Survey
export const findAllSurveys = S.pipe ([
  _ => flDetaBase ('fetch') ({type: 'surveys'}),
  S.map (S.prop ('items')),
  S.map (S.map (S.prop ('data'))),
])

// String -> Future Error Array Surveys
export const findAllSurveysByReason = S.pipe ([
  reason =>
    flDetaBase ('fetch') ({'data.reason?contains': reason}),
  S.map (S.prop ('items')),
  S.map (S.map (S.prop ('data'))),
])

// Array StrMap String -> Future Error Array Survey
export const insertManyToSurveys = data =>
  S.all (x => sameValues (Survey) (S.keys (x))) (data)
    ? S.pipe ([
        S.map (data => ({type: 'surveys', data})),
        flDetaBase ('putMany'),
        S.map (S.props (['processed', 'items'])),
        S.map (S.map (S.prop ('data'))),
      ]) (data)
    : F.reject ('Wrong query columns Survey')
