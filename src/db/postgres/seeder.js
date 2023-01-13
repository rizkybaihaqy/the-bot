import {insertManyToSales} from '../../data-access/sales'
import {insertManyToSurveys} from '../../data-access/surveys'
import {insertManyToVisits} from '../../data-access/visits'
import {F} from '../../lib/fluture'
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
    S.map ((x) => x.length),
    S.chain (visitsSeeder (nVisits)),
    S.map ((_) => nSurveys),
    S.chain (surveysSeeder),
  ]) (nSales)

F.fork ((x) => (console.log (x), x)) (
  (x) => (console.log ('seeding complete'), x),
) (seed (3) (18) (22))
