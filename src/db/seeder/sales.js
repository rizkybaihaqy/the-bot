import {faker} from '@faker-js/faker/locale/id_ID'
import {insertManyToSales} from '../../data-access/sales'

const fakeSales = (n) =>
  [...Array (n)].map ((_, i) => [
    faker.name.fullName (),
    faker.random.numeric (9),
  ])

const testUser = [ 'Rizky Baihaqy', '642130106' ]

export const salesSeeder = (n) =>
  insertManyToSales ([ ...fakeSales (n), testUser ])
