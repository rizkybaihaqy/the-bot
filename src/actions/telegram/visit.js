import {Next} from 'fluture-express'
import {F, JSONData} from '../../lib/fluture'
import {S} from '../../lib/sanctuary'
import {isCommandEqualsTo} from '../../lib/telegram/predicate'
import Survey from '../../models/Survey'
import Visit from '../../models/Visit'
import {getTranslation, t} from '../../translation'

// f (Any -> Maybe) -> Array String -> String
const fieldFromModel = fns =>
  S.pipe ([
    fns,
    S.fromMaybe ([]),
    S.map (getTranslation),
    S.joinWith (':\n'),
    x => x + ':',
  ])

// Locals -> Req -> Future Error Axios
export default locals =>
  S.ifElse (isCommandEqualsTo ('/visit')) (
    S.pipe ([
      _ => t ('msg_what_kind_of_visit?'),
      locals.sendMessage ({
        inline_keyboard: [
          [
            {
              text: 'Report Visits',
              switch_inline_query_current_chat:
                '\n#VisitReport\n' +
                fieldFromModel (S.dropLast (3)) (Visit),
            },
          ],
          [
            {
              text: 'Report Survey',
              switch_inline_query_current_chat:
                '\n#SurveyForm\n' +
                fieldFromModel (S.dropLast (4)) (Survey),
            },
          ],
        ],
      }),
      S.map (JSONData),
    ])
  ) (_ => F.resolve (Next (locals)))
