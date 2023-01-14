import {fork} from 'fluture'
import {insertManyToSales} from '../../data-access/deta-base/sales'
import {insertManyToSurveys} from '../../data-access/deta-base/surveys'
import {insertManyToVisits} from '../../data-access/deta-base/visits'
import {S} from '../../lib/sanctuary'
import {fakeSales, testSales} from '../seeder/sales'
import {fakeSurveys} from '../seeder/surveys'
import {fakeVisits} from '../seeder/visits'

const salesSeeder = (n) =>
  insertManyToSales ([ ...fakeSales (n), testSales ])
const visitsSeeder = (nVisits) => (nSales) =>
  insertManyToVisits (fakeVisits (nVisits) (nSales))
const surveysSeeder = (n) =>
  insertManyToSurveys (fakeSurveys (n))

const seed = (nSales) => (nVisits) => (nSurveys) =>
  S.pipe ([
    (x) => (console.log ('Seeding'), x),
    salesSeeder,
    S.map (S.map (S.prop ('sales_code'))),
    S.chain (visitsSeeder (nVisits)),
    S.chain ((_) => surveysSeeder (nSurveys)),
  ]) (nSales)

fork ((x) => (console.log (x), x)) (
  (x) => (console.log ('seeding complete'), x),
) (seed (1) (1) (1))
