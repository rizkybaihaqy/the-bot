import {flDetaBase} from '../../db/deta-base'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sameValues} from '../../lib/utils/getter'
import Visit from '../../models/Visit'

// StrMap String -> Future Error Visit
export const insertOneToVisits = (data) =>
  sameValues (S.keys (data)) (Visit)
    ? S.pipe ([
        (data) => ({type: 'visits', data}),
        flDetaBase ('put'),
        S.map (S.prop ('data')),
      ]) (data)
    : F.reject ('Wrong query columns Visits')

// Array StrMap String -> Future Error Array Visit
export const insertManyToVisits = (data) =>
  S.all ((x) => sameValues (Visit) (S.keys (x))) (data)
    ? S.pipe ([
        S.map ((data) => ({type: 'visits', data})),
        flDetaBase ('putMany'),
        S.map (S.props ([ 'processed', 'items' ])),
        S.map (S.map (S.prop ('data'))),
      ]) (data)
    : F.reject ('Wrong query columns on Visit')

// TODO: Find By Date (Currently GetAll)
// String -> Future Error Array Visit
export const findAllTodayVisits = S.pipe ([
  () => flDetaBase ('fetch') (),
  S.map (S.prop ('items')),
])
