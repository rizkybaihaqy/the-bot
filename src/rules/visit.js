import {S} from '../lib/sanctuary'
import { isEmptyString } from '../lib/utils/predicate'

export const visitRules = {
  track_id: S.tagBy (S.complement (isEmptyString)),
  customer_name: S.tagBy (S.complement (isEmptyString)),
  customer_email: S.tagBy (S.complement (isEmptyString)),
  customer_cp: S.tagBy (S.complement (isEmptyString)),
  customer_alt_cp: S.tagBy (S.complement (isEmptyString)),
  odp_datek: S.tagBy (S.complement (isEmptyString)),
  odp_alternative_1: S.tagBy (S.complement (isEmptyString)),
  odp_alternative_2: S.tagBy (S.complement (isEmptyString)),
  id_pln: S.tagBy (S.complement (isEmptyString)),
  address: S.tagBy (S.complement (isEmptyString)),
  package_desc: S.tagBy (S.complement (isEmptyString)),
  home_state: S.tagBy (S.complement (isEmptyString)),
  additional_desc: S.tagBy (S.complement (isEmptyString)),
  location: S.tagBy (S.complement (isEmptyString)),
  telegram_id: S.tagBy (S.complement (isEmptyString)),
}
