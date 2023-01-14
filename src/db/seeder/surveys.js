import {faker} from '@faker-js/faker/locale/id_ID'
import sub from 'date-fns/sub'
import {dateToStringWithTZ} from '../../lib/utils/getter'

const date = new Date ()

export const fakeSurveys = (n) =>
  [...Array (n)].map ((_, i) => ({
    respondent_name: faker.name.fullName (),
    age: faker.datatype
      .number ({min: 18, max: 100})
      .toString (),
    job: faker.name.jobTitle (),
    home_state: faker.helpers.arrayElement ([
      'private',
      'rental',
      'state_property',
    ]),
    reason: faker.helpers.arrayElement ([
      'no_need_for_internet',
      'already_subscribe_to_competitor',
      'need_cheaper_package',
      'unsubscribed_disappointed',
      'other',
    ]),
    additional_desc: faker.lorem.text (),
    location: faker.address
      .nearbyGPSCoordinate ([ -7.057418, 110.44067 ], 1, true)
      .toString (),
    created_at: dateToStringWithTZ (
      faker.date.between (
        sub (date, {days: 3}).toISOString (),
        date.toISOString (),
      ),
    ),
  }))
