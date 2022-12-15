import {fork, reject, resolve} from 'fluture'
import {S} from '../../lib/sanctuary'
import {salesSeeder} from './sales'
import {visitsSeeder} from './visits'

const seed = (nSales) => (nVisits) =>
  S.pipe ([
    (x => (console.log ('Seeding'), x)),
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
  ]) (nSales)

fork ((x) => (console.log (x), x)) (
  (x) => (console.log ('seeding complete'), x),
) (seed (3) (18))
