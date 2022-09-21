import {faker} from '@faker-js/faker/locale/id_ID'
import {dbQuery} from '../instance'
import {insertTo} from '../query'

const fakeVisits = (n) =>
  [...Array (n)].map ((_, i) => [
    [
      faker.address.streetAddress (),
      faker.helpers.arrayElement ([
        'mip',
        'landing_page',
        'sobi',
        'no_deal',
      ]),
      faker.random.numeric (1),
    ],
  ])

const qs = insertTo ('visits') ([
  'address',
  'channel',
  'sales_id',
]) (fakeVisits (100))

dbQuery ({name: 'visits', text: qs}, (err, result) => {
  if (err) {
    console.error (err)
  }
  console.log (result.rows)
})
