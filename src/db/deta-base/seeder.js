import {fork} from 'fluture'
import {insertManyToSales} from '../../data-access/deta-base/sales'
import {insertManyToSurveys} from '../../data-access/deta-base/surveys'
import {insertManyToVisits} from '../../data-access/deta-base/visits'
import {S} from '../../lib/sanctuary'
import {fakeSales, testSales} from '../seeder/sales'
import {fakeSurveys} from '../seeder/surveys'
import {fakeVisits} from '../seeder/visits'

const salesSeeder = n =>
  insertManyToSales ([...fakeSales (n), testSales])
const visitsSeeder = nVisits => nSales =>
  insertManyToVisits (fakeVisits (nVisits) (nSales))
const surveysSeeder = n =>
  insertManyToSurveys (fakeSurveys (n))

const seed = nSales => nVisits => nSurveys =>
  S.pipe ([
    // eslint-disable-next-line no-sequences
    x => (console.log ('Seeding'), x),
    salesSeeder,
    S.map (S.map (S.prop ('sales_code'))),
    S.chain (visitsSeeder (nVisits)),
    S.chain (_ => surveysSeeder (nSurveys)),
  ]) (nSales)

/* eslint-disable functional/no-expression-statement, no-sequences */
fork (x => (console.log (x), x)) (
  x => (console.log ('seeding complete'), x)
) (seed (1) (5) (5))
