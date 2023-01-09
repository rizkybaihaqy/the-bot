import {faker} from '@faker-js/faker/locale/id_ID'
import {insertManyToSurveys} from '../../data-access/surveys'

const fakeSurveys = (n) =>
  [...Array (n)].map ((_, i) => [
    [
      faker.name.fullName (),
      faker.datatype.number ({min: 18, max: 100}).toString (),
      faker.name.jobTitle (),
      faker.helpers.arrayElement ([
        'private',
        'rental',
        'state_property',
      ]),
      faker.helpers.arrayElement ([
        'no_need_for_internet',
        'already_subscribe_to_competitor',
        'need_cheaper_package',
        'unsubscribed_disappointed',
        'other',
      ]),
      faker.lorem.text (),
      faker.address
        .nearbyGPSCoordinate (
          [ -7.057418, 110.44067 ],
          1,
          true,
        )
        .toString (),
    ],
  ])

export const surveysSeeder = (n) =>
  insertManyToSurveys (fakeSurveys (n))
