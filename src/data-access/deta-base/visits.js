import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {sameValues} from '../../lib/utils/getter'
import Visit from '../../models/Visit'

// StrMap String -> Future Error Visit
export const insertOneToVisits = (data) =>
  sameValues (S.keys (data)) (Visit)
    ? flDetaBase ('put') (data)
    : F.reject ('Wrong query columns')

// Array StrMap String -> Future Error Array Visit
export const insertManyToVisits = (data) =>
  sameValues (S.keys (data)) (Visit)
    ? flDetaBase ('putMany') (data)
    : F.reject ('Wrong query columns')

// TODO: Find By Date (Currently GetAll)
// String -> Future Error Array Visit
export const findAllTodayVisits = (date) =>
  flDetaBase ('fetch') ()
