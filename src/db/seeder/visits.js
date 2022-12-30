import {faker} from '@faker-js/faker/locale/id_ID'
import {pgFlQuery} from '../instance'
import {insertTo} from '../query'

const fakeVisits = (n) => (nSales) =>
  [...Array (n)].map ((_, i) => [
    [
      `MYID-${faker.random.numeric (13)}`,
      faker.name.fullName (),
      faker.internet.email (),
      faker.phone.number (),
      faker.phone.number (),
      faker.random.alphaNumeric (10, {casing: 'upper'}),
      faker.random.alphaNumeric (10, {casing: 'upper'}),
      faker.random.alphaNumeric (10, {casing: 'upper'}),
      faker.random.numeric (10, {allowLeadingZeros: true}),
      faker.address.streetAddress (),
      faker.lorem.text (),
      faker.helpers.arrayElement ([
        'private',
        'rental',
        'state_property',
      ]),
      faker.lorem.text (),
      faker.address.nearbyGPSCoordinate (
        [ -7.057418, 110.44067 ],
        1,
        true,
      ).toString (),
      // faker.helpers.arrayElement ([
      //   'mip',
      //   'landing_page',
      //   'sobi',
      //   'no_deal',
      // ]),
      faker.datatype.number ({min: 1, max: nSales}),
    ],
  ])

export const visitsSeeder = (n) => (nSales) =>
  pgFlQuery (
    insertTo ('visits') ([
      'track_id',
      'customer_name',
      'customer_email',
      'customer_cp',
      'customer_alt_cp',
      'odp_datek',
      'odp_alternative_1',
      'odp_alternative_2',
      'id_pln',
      'address',
      'package_desc',
      'home_state',
      'additional_desc',
      'location',
      'sales_id',
    ]) (fakeVisits (n) (nSales)),
  )
