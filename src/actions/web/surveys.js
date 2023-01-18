import {Render} from 'fluture-express'
import {F} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'

export default locals =>
  S.pipe ([
    _ => [
      {
        respondent_name: 'Karen Rahmawati',
        age: '49',
        job: 'International Program Coordinator',
        home_state: 'private',
        reason: 'other',
        additional_desc:
          'Est laboriosam saepe. Et ut dolores odit eligendi. Sit vitae et enim et nulla consequatur ut. Et est est eligendi ut nulla. Quasi aut rerum exercitationem voluptas sunt ut magnam sint rerum. Sed et et eaque sequi repellendus.',
        location: '-7.0591,110.4336',
        created_at: '2023-01-15 22:27:43',
      },
      {
        respondent_name: 'Rosalina Saputri',
        age: '68',
        job: 'Customer Applications Manager',
        home_state: 'state_property',
        reason: 'no_need_for_internet',
        additional_desc:
          'Esse qui ad quae voluptatibus excepturi amet voluptatem. Debitis dolor ullam occaecati laboriosam qui. Omnis et qui repudiandae necessitatibus laborum in doloremque in inventore. Eos voluptatum sed aut quos perferendis fuga qui consequatur illo. Doloremque repudiandae sed et quibusdam nihil consequatur.',
        location: '-7.0616,110.4441',
        created_at: '2023-01-14 16:10:34',
      },
      {
        respondent_name: 'Jaka Sirait',
        age: '21',
        job: 'Direct Integration Specialist',
        home_state: 'state_property',
        reason: 'unsubscribed_disappointed',
        additional_desc:
          'Vel pariatur voluptatum laboriosam velit voluptatibus nulla sit.\n' +
          'Quas vitae iusto qui eum omnis tempora nostrum.\n' +
          'Pariatur sed qui enim.\n' +
          'Molestias quis assumenda ad dolorem.\n' +
          'Quia illo sequi aspernatur et eum nesciunt.',
        location: '-7.0558,110.4351',
        created_at: '2023-01-14 23:47:18',
      },
    ],
    data => F.resolve (Render ('data') ({data, type: 'surveys'})),
  ])
