import {Render} from 'fluture-express'
import {F} from '../lib/fluture'
import {S} from '../lib/sanctuary'

export default locals =>
  S.pipe ([
    _ => [
      {
        track_id: 'MYID-8988372072002',
        customer_name: 'Vanya Aryanti',
        customer_email: 'Leif_Weissnat@gmail.co.id',
        customer_cp: '(+62) 274 2092 978',
        customer_alt_cp: '(+62) 585 9953 4875',
        odp_datek: '68K4B7NCBZ',
        odp_alternative_1: 'MGEIBYMPME',
        odp_alternative_2: 'CGTIT6VQRS',
        id_pln: '0433007430',
        address: 'Psr. German no 97',
        package_desc:
          'Debitis illo et.\nOmnis enim deleniti neque.',
        home_state: 'private',
        additional_desc: 'hic quam nemo',
        location: '-7.0489,110.4415',
        sales_id: '9398',
        created_at: '2023-01-14 09:32:11',
      },
      {
        track_id: 'MYID-6609891114456',
        customer_name: 'Rosalina Puspita',
        customer_email: 'Emerson_Larson54@gmail.com',
        customer_cp: '(+62) 384 3270 3816',
        customer_alt_cp: '0348 8620 875',
        odp_datek: 'T2IWWH7X7K',
        odp_alternative_1: 'DSJPH58OBY',
        odp_alternative_2: 'L35466DRZR',
        id_pln: '7736769683',
        address: 'Kpg. Alvina no 5',
        package_desc:
          'Odit enim consequuntur quas qui aut.',
        home_state: 'rental',
        additional_desc: 'voluptatum',
        location: '-7.0559,110.4377',
        sales_id: '1001',
        created_at: '2023-01-15 15:36:03',
      },
      {
        track_id: 'MYID-8844272772129',
        customer_name: 'Kambali Mansur',
        customer_email: 'Buck24@yahoo.co.id',
        customer_cp: '0657 8755 591',
        customer_alt_cp: '0474 7089 7053',
        odp_datek: 'I6MA2IOLTP',
        odp_alternative_1: 'YDL00DALVD',
        odp_alternative_2: '9CCUVXXZLP',
        id_pln: '1330360468',
        address: 'Jln. Jamarcus no 05',
        package_desc: 'sit',
        home_state: 'rental',
        additional_desc: 'ad perferendis velit',
        location: '-7.0644,110.4391',
        sales_id: '2333',
        created_at: '2023-01-14 10:15:57',
      },
    ],
    data =>
      F.resolve (Render ('data') ({data, type: 'visits'})),
  ])
