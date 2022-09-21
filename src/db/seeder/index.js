import {fork, reject, resolve} from 'fluture'
import {S} from '../../lib/sanctuary/instance'
import {checkPoint, tap} from '../../lib/utils'
import {salesSeeder} from './sales'
import {visitsSeeder} from './visits'

const seed = (nSales) => (nVisits) =>
  S.pipe ([
    checkPoint ('seeding'),
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

fork (tap) (checkPoint ('seeding success')) (seed (3) (6))
