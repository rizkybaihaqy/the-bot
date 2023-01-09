import {fork, reject, resolve} from 'fluture'
import {S} from '../../lib/sanctuary'
import {salesSeeder} from './sales'
import {surveysSeeder} from './surveys'
import {visitsSeeder} from './visits'

const seed = (nSales) => (nVisits) => (nSurveys) =>
  S.pipe ([
    (x) => (console.log ('Seeding'), x),
    salesSeeder,
    S.chain (
      S.pipe ([
        S.prop ('rows'),
        S.last,
        S.map (S.prop ('id')),
        S.maybe (reject ('No Id Found')) (resolve),
      ]),
    ),
    S.chain (visitsSeeder (nVisits)),
    S.chain ((_) => surveysSeeder (nSurveys)),
  ]) (nSales)

fork ((x) => (console.log (x), x)) (
  (x) => (console.log ('seeding complete'), x),
) (seed (3) (18) (22))
