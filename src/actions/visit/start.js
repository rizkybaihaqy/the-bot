import {headerCase} from 'change-case'
import F from 'fluture'
import {Next} from 'fluture-express'
import {JSONData} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {isCommandEqualsTo} from '../../lib/telegram/predicate'
import Visit from '../../models/Visit'

// Array String -> String
const field = S.pipe ([
  S.dropLast (2),
  S.fromMaybe ([]),
  S.map ((x) => headerCase (x, {delimiter: ' '})),
  S.joinWith (':\n'),
  (x) => x + ':',
])

// Locals -> Req -> Future Error Axios
export default (locals) =>
  S.ifElse (isCommandEqualsTo ('/visit')) (
    S.pipe ([
      (_) => 'Which visit you want to report ?',
      locals.sendMessage ({
        inline_keyboard: [
          [
            {
              text: 'Report Visits',
              switch_inline_query_current_chat:
                '\n#VisitReport\n' + field (Visit),
            },
          ],
          [
            {
              text: 'Report Survey',
              callback_data: 'visit_survey',
            },
          ],
        ],
      }),
      S.map (JSONData),
    ]),
  ) ((_) => F.resolve (Next (locals)))
