import {flDetaBase} from '../../db/deta-base'
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
