/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable ('sales', {
    id: 'id',
    name: {type: 'varchar(1000)', notNull: true},
    telegram_id: {type: 'varchar(1000)', notNull: true},
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func ('current_timestamp'),
    },
  }),
    // pgm.createType ('channel_list', [
    //   'mip',
    //   'sobi',
    //   'landing_page',
    //   'no_deal',
    // ]),
    pgm.createTable ('visits', {
      id: 'id',
      customer_name: {type: 'varchar(1000)', notNull: true},
      customer_email: {
        type: 'varchar(1000)',
        notNull: true,
      },
      customer_cp: {type: 'varchar(1000)', notNull: true},
      customer_alt_cp: {
        type: 'varchar(1000)',
        notNull: true,
      },
      odp_datek: {type: 'varchar(1000)', notNull: true},
      odp_alternative_1: {
        type: 'varchar(1000)',
        notNull: true,
      },
      odp_alternative_2: {
        type: 'varchar(1000)',
        notNull: true,
      },
      id_pln: {type: 'varchar(1000)', notNull: true},
      address: {type: 'varchar(1000)', notNull: true},
      package_desc: {type: 'varchar(1000)', notNull: true},
      home_state: {type: 'varchar(1000)', notNull: true},
      additional_desc: {
        type: 'varchar(1000)',
        notNull: true,
      },
      // channel: {type: '"channel_list"', notNull: true},
      sales_id: {
        type: 'integer',
        notNull: true,
        references: '"sales"',
        onDelete: 'cascade',
      },
      created_at: {
        type: 'timestamp',
        notNull: true,
        default: pgm.func ('current_timestamp'),
      },
    })
}
