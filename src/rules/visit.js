import {notAnEmpty, validator} from '../lib/utils/validator'

export const visitRules = {
  track_id: validator ('track_id') ([notAnEmpty (String)]),
  customer_name: validator ('customer_name') ([
    notAnEmpty (String),
  ]),
  customer_email: validator ('customer_email') ([
    notAnEmpty (String),
  ]),
  customer_cp: validator ('customer_cp') ([
    notAnEmpty (String),
  ]),
  customer_alt_cp: validator ('customer_alt_cp') ([
    notAnEmpty (String),
  ]),
  odp_datek: validator ('odp_datek') ([notAnEmpty (String)]),
  odp_alternative_1: validator ('odp_alternative_1') ([
    notAnEmpty (String),
  ]),
  odp_alternative_2: validator ('odp_alternative_2') ([
    notAnEmpty (String),
  ]),
  id_pln: validator ('id_pln') ([notAnEmpty (String)]),
  address: validator ('address') ([notAnEmpty (String)]),
  package_desc: validator ('package_desc') ([
    notAnEmpty (String),
  ]),
  home_state: validator ('home_state') ([notAnEmpty (String)]),
  additional_desc: validator ('additional_desc') ([
    notAnEmpty (String),
  ]),
  location: validator ('location') ([notAnEmpty (String)]),
  telegram_id: validator ('telegram_id') ([
    notAnEmpty (String),
  ]),
}
