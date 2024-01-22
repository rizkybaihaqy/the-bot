import {faker} from '@faker-js/faker/locale/id_ID'
import {sub} from 'date-fns'
import {dateToStringWithTZ} from '../../lib/utils/date'

const date = new Date ()

export const fakeVisits = n => salesCodes =>
  [...Array (n)].map ((_, i) => ({
    track_id: `MYID-${faker.random.numeric (13)}`,
    customer_name: faker.name.fullName (),
    customer_email: faker.internet.email (),
    customer_cp: faker.phone.number (),
    customer_alt_cp: faker.phone.number (),
    odp_datek: faker.random.alphaNumeric (10, {
      casing: 'upper',
    }),
    odp_alternative_1: faker.random.alphaNumeric (10, {
      casing: 'upper',
    }),
    odp_alternative_2: faker.random.alphaNumeric (10, {
      casing: 'upper',
    }),
    id_pln: faker.random.numeric (10, {
      allowLeadingZeros: true,
    }),
    address: faker.address.streetAddress (),
    package_desc: faker.lorem.sentence (),
    home_state: faker.helpers.arrayElement ([
      'private',
      'rental',
      'state_property',
    ]),
    additional_desc: faker.lorem.sentence (),
    location: faker.address
      .nearbyGPSCoordinate ([-7.057418, 110.44067], 1, true)
      .toString (),
    sales_id: faker.helpers.arrayElement (salesCodes),
    created_at: dateToStringWithTZ (
      faker.date.between (
        sub (date, {days: 3}).toISOString (),
        date.toISOString ()
      )
    ),
  }))
