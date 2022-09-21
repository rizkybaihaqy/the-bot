import {faker} from '@faker-js/faker/locale/id_ID'
import {pgFlQuery} from '../instance'
import {insertTo} from '../query'

const fakeNames = (n) =>
  [...Array (n)].map ((_, i) => [faker.name.fullName ()])

export const salesSeeder = (n) =>
  pgFlQuery (insertTo ('sales') ('name') (fakeNames (n)))
