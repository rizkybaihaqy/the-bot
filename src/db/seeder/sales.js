import {faker} from '@faker-js/faker/locale/id_ID'

export const fakeSales = (n) =>
  [...Array (n)].map ((_, i) => ({
    name: faker.name.fullName (),
    telegram_id: faker.random.numeric (9),
  }))

export const testSales = {
  name: 'Rizky Baihaqy',
  telegram_id: '642130106',
}
