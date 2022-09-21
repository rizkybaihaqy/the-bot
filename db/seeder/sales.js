import {faker} from '@faker-js/faker/locale/id_ID'
import {format} from 'node-pg-format'
import {dbQuery} from '../index'

const fakeNames = (n) =>
  [...Array (n)].map ((_, i) => [faker.name.fullName ()])

const insertTo = (table) => (cols) => (data) =>
  format (
    'INSERT INTO %I(%I) VALUES %L RETURNING *',
    table,
    cols,
    data,
  )
const sqs = insertTo ('sales') ('name') (fakeNames (10))
const query = (qs) => (name) => ({name, text: qs})

dbQuery (
  query (sqs) ('visits'),
  (err, result) => {
    if (err) {
      console.error (err)
    }
    console.log (result.rows)
  },
)
