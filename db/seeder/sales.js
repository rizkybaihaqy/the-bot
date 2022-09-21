import {faker} from '@faker-js/faker/locale/id_ID'
import {dbQuery} from '../instance'
import {insertTo} from '../query'

const fakeNames = (n) =>
  [...Array (n)].map ((_, i) => [faker.name.fullName ()])

const qs = insertTo ('sales') ('name') (fakeNames (10))

dbQuery ({name: 'sales', text: qs}, (err, result) => {
  if (err) {
    console.error (err)
  }
  console.log (result.rows)
})
