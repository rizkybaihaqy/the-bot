import {notAnEmpty, validator} from '../lib/utils/validator'

export const surveyRules = {
  respondent_name: validator ('respondent_name') ([
    notAnEmpty (String),
  ]),
  age: validator ('age') ([notAnEmpty (String)]),
  job: validator ('job') ([notAnEmpty (String)]),
  home_state: validator ('home_state') ([notAnEmpty (String)]),
  reason: validator ('reason') ([notAnEmpty (String)]),
  additional_desc: validator ('additional_desc') ([
    notAnEmpty (String),
  ]),
  location: validator ('location') ([notAnEmpty (String)]),
}
