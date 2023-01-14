import {faker} from '@faker-js/faker/locale/id_ID'
import sub from 'date-fns/sub'
import {dateToStringWithTZ} from '../../lib/utils/getter'

const date = new Date ()

export const fakeSales = (n) =>
  [...Array (n)].map ((_, i) => ({
    sales_code: faker.random.numeric (4),
    name: faker.name.fullName (),
    telegram_id: faker.random.numeric (9),
    created_at: dateToStringWithTZ (
      faker.date.between (
        sub (date, {days: 3}).toISOString (),
        date.toISOString (),
      ),
    ),
  }))

export const testSales = {
  sales_code: '1001',
  name: 'Rizky Baihaqy',
  telegram_id: '642130106',
  created_at: dateToStringWithTZ (date),
}
