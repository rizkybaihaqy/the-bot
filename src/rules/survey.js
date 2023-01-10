import {S} from '../lib/sanctuary'
import {isEmptyString} from '../lib/utils/predicate'

export const surveyRules = {
  respondent_name: S.tagBy (S.complement (isEmptyString)),
  age: S.tagBy (S.complement (isEmptyString)),
  job: S.tagBy (S.complement (isEmptyString)),
  home_state: S.tagBy (S.complement (isEmptyString)),
  reason: S.tagBy (S.complement (isEmptyString)),
  additional_desc: S.tagBy (S.complement (isEmptyString)),
  location: S.tagBy (S.complement (isEmptyString)),
}
