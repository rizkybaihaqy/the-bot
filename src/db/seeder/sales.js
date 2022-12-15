import {faker} from '@faker-js/faker/locale/id_ID'
import {pgFlQuery} from '../instance'
import {insertTo} from '../query'

const fakeSales = (n) =>
  [...Array (n)].map ((_, i) => [
    faker.name.fullName (),
    faker.random.numeric (9),
  ])

const testUser = [ 'Rizky Baihaqy', '642130106' ]

export const salesSeeder = (n) =>
  pgFlQuery (
    insertTo ('sales') ([ 'name', 'telegram_id' ]) ([ ...fakeSales (n), testUser ]),
  )
