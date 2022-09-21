import {faker} from '@faker-js/faker/locale/id_ID'
import {pgFlQuery} from '../instance'
import {insertTo} from '../query'

const fakeVisits = (n) => (nSales) =>
  [...Array (n)].map ((_, i) => [
    [
      faker.address.streetAddress (),
      faker.helpers.arrayElement ([
        'mip',
        'landing_page',
        'sobi',
        'no_deal',
      ]),
      faker.datatype.number ({min: 1, max: nSales}),
    ],
  ])

export const visitsSeeder = (n) => (nSales) =>
  pgFlQuery (
    insertTo ('visits') ([ 'address', 'channel', 'sales_id' ]) (
      fakeVisits (n) (nSales),
    ),
  )
