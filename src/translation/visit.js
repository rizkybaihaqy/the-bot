/* cSpell:disable */
import {S} from '../lib/sanctuary'

export const visit = [
  S.Pair ('track_id') ('track_id'),
  S.Pair ('customer_name') ('nama_pelanggan'),
  S.Pair ('customer_email') ('email_pelanggan'),
  S.Pair ('customer_cp') ('kontak_pelanggan'),
  S.Pair ('customer_alt_cp') ('kontak_lain_pelanggan'),
  S.Pair ('odp_datek') ('odp_datek'),
  S.Pair ('odp_alternative_1') ('odp_alternative_1'),
  S.Pair ('odp_alternative_2') ('odp_alternative_2'),
  S.Pair ('id_pln') ('id_pln'),
  S.Pair ('address') ('alamat'),
  S.Pair ('package_desc') ('deskripsi_paket'),
  S.Pair ('home_state') ('status_rumah'),
  S.Pair ('additional_desc') ('deskripsi_tambahan'),
  S.Pair ('location') ('lokasi'),
  S.Pair ('sales_id') ('sales_id'),
  S.Pair ('created_at') ('dibuat_pada'),
]
