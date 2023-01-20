import {formatISO9075} from 'date-fns'
import {flDetaBase} from '../../db/deta-base'
import {F, maybeToFuture} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sameValues} from '../../lib/utils/getter'
import Visit from '../../models/Visit'

// StrMap String -> Future Error Visit
export const insertOneToVisits = data =>
  sameValues (S.keys (data)) (Visit)
    ? S.pipe ([
        data => ({type: 'visits', data}),
        flDetaBase ('put'),
        S.map (S.prop ('data')),
      ]) (data)
    : F.reject ('Wrong query columns Visits')

// Empty -> Future Error Array Visit
export const findAllVisits = S.pipe ([
  _ => flDetaBase ('fetch') ({type: 'visits'}),
  S.map (S.prop ('items')),
  S.map (S.map (S.prop ('data'))),
])

// Array StrMap String -> Future Error Array Visit
export const insertManyToVisits = data =>
  S.all (x => sameValues (Visit) (S.keys (x))) (data)
    ? S.pipe ([
        S.map (data => ({type: 'visits', data})),
        flDetaBase ('putMany'),
        S.map (S.props (['processed', 'items'])),
        S.map (S.map (S.prop ('data'))),
      ]) (data)
    : F.reject ('Wrong query columns on Visit')

// String -> Future Error Array Visit
export const findAllTodayVisits = S.pipe ([
  S.parseDate,
  maybeToFuture,
  S.map (date =>
    formatISO9075 (date, {representation: 'date'})
  ),
  S.chain (date =>
    flDetaBase ('fetch') ({
      'data.created_at?contains': date,
      'type': 'visits',
    })
  ),
  S.map (S.prop ('items')),
])
