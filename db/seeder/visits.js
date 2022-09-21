import {faker} from '@faker-js/faker/locale/id_ID'
import {format} from 'node-pg-format'
import {dbQuery} from '../index'

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

const insertTo = (table) => (cols) => (data) =>
  format (
    'INSERT INTO %I(%I) VALUES %L RETURNING *',
    table,
    cols,
    data,
  )
const sqs = insertTo ('visits') ([
  'address',
  'channel',
  'sales_id',
]) (fakeVisits (100))
const query = (qs) => (name) => ({name, text: qs})

dbQuery (query (sqs) ('visits'), (err, result) => {
  if (err) {
    console.error (err)
  }
  console.log (result.rows)
})
