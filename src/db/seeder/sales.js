import {faker} from '@faker-js/faker/locale/id_ID'
import sub from 'date-fns/sub'

const date = new Date ()

export const fakeSales = (n) =>
  [...Array (n)].map ((_, i) => ({
    sales_code: faker.random.numeric (4),
    name: faker.name.fullName (),
    telegram_id: faker.random.numeric (9),
    created_at: faker.date
      .between (
        sub (date, {days: 3}).toISOString (),
        date.toISOString (),
      )
      .toISOString (),
  }))

export const testSales = {
  sales_code: '1001',
  name: 'Rizky Baihaqy',
  telegram_id: '642130106',
  created_at: date.toISOString (),
}
