import {headerCase} from 'change-case'
import {Next} from 'fluture-express'
import {F, JSONData} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {isCommandEqualsTo} from '../../lib/telegram/predicate'
import Survey from '../../models/Survey'
import Visit from '../../models/Visit'

// f (Any -> Any) -> Array String -> String
const fieldFromModel = fns =>
  S.pipe ([
    fns,
    S.fromMaybe ([]),
    S.map (x => headerCase (x, {delimiter: ' '})),
    S.joinWith (':\n'),
    x => x + ':',
  ])

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isCommandEqualsTo ('/visit')) (
    S.pipe ([
      _ => 'Which visit you want to report ?',
      locals.sendMessage ({
        inline_keyboard: [
          [
            {
              text: 'Report Visits',
              switch_inline_query_current_chat:
                '\n#VisitReport\n' +
                fieldFromModel (S.dropLast (2)) (Visit),
            },
          ],
          [
            {
              text: 'Report Survey',
              switch_inline_query_current_chat:
                '\n#SurveyForm\n' +
                fieldFromModel (S.dropLast (3)) (Survey),
            },
          ],
        ],
      }),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
